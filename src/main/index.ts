// src/main/index.ts
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, net, protocol, shell } from 'electron'
import fs from 'fs/promises'
import { join } from 'path'
import { pathToFileURL } from 'url'

import { dbOperations } from './lib/db'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local',
    privileges: {
      standard: true,
      secure: true,
      stream: true,
      supportFetchAPI: true,
      bypassCSP: true
    }
  }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: join(process.cwd(), 'resources', 'logo.ico'),
    show: false,
    frame: false,
    transparent: true,
    vibrancy: 'sidebar',
    backgroundMaterial: 'acrylic',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // --- WINDOW CONTROLS IPC ---
  ipcMain.on('window:minimize', (e) => {
    BrowserWindow.fromWebContents(e.sender)?.minimize()
  })

  ipcMain.on('window:maximize', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })

  ipcMain.on('window:close', (e) => {
    BrowserWindow.fromWebContents(e.sender)?.close()
  })

  // --- DATABASE IPC HANDLERS ---
  ipcMain.handle('db:get-all-notes', async () => {
    return dbOperations.getAllNotes()
  })

  ipcMain.handle(`db:save-note`, async (_, note) => {
    return dbOperations.saveNote(note)
  })

  ipcMain.handle(`db:update-note`, async (_, id, title, content) => {
    return dbOperations.updateNote(id, title, content)
  })

  ipcMain.handle('db:delete-note', async (_, id) => {
    return dbOperations.deleteNote(id)
  })

  // --- BULLETPROOF OS PROTOCOL ---
  protocol.handle('local', (request) => {
    try {
      // Parse the incoming URL (e.g., local://media?path=C%3A%5C...)
      const url = new URL(request.url)

      // Extract the actual system path
      const decodedPath = url.searchParams.get('path')

      if (!decodedPath) {
        console.error('Invalid media request: No path provided')
        return new Response(null, { status: 404 })
      }

      // Convert to a native file:// URI and explicitly bypass custom handlers
      // so Chromium can stream the file natively
      return net.fetch(pathToFileURL(decodedPath).toString(), {
        headers: request.headers,
        method: request.method,
        bypassCustomProtocolHandlers: true
      })
    } catch (err) {
      console.error('Local protocol error:', err)
      return new Response(null, { status: 500 })
    }
  })

  // --- LOCAL MEDIA SCANNER IPC ---
  ipcMain.handle('media:select-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (canceled || filePaths.length === 0) return []

    const folderPath = filePaths[0]

    try {
      const files = await fs.readdir(folderPath)

      const localMedia = files
        .filter(
          (file) =>
            file.endsWith('.mp3') ||
            file.endsWith('.m4a') ||
            file.endsWith('.mp4') ||
            file.endsWith('.mkv')
        )
        .map((file) => {
          const fullPath = join(folderPath, file)

          return {
            trackId: file,
            trackName: file.replace(/\.[^/.]+$/, ''),
            artistName: 'Local File',
            // CRITICAL: Dummy host 'media' + query parameter 'path'
            previewUrl: `local://media?path=${encodeURIComponent(fullPath)}`,
            artworkUrl100: '',
            kind: file.endsWith('.mp4') || file.endsWith('.mkv') ? 'video' : 'song',
            isLocal: true
          }
        })

      return localMedia
    } catch (err) {
      console.error('Failed to read directory:', err)
      return []
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

try {
  require('electron-reload')(__dirname, {
    electron: require('electron') // <-- load from root node_modules
  })
} catch (err) {
  console.log('Auto-reload disabled:', err)
}
