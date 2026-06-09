import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, net, protocol, shell } from 'electron'
import fs from 'fs/promises'
import { join } from 'path'

import { dbOperations } from './lib/dbOperations'

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
  protocol.handle('local', async (request) => {
    try {
      const url = new URL(request.url)
      const decodedPath = url.searchParams.get('path')

      if (!decodedPath) {
        return new Response('No path provided', { status: 400 })
      }

      // 1. Get file stats to know the total file size
      const stat = await fs.stat(decodedPath)
      const fileSize = stat.size

      // 2. Parse the Range header (e.g., "bytes=32324-")
      const rangeHeader = request.headers.get('Range')

      if (rangeHeader) {
        // --- CHUNKED STREAMING (For seeking in the timeline) ---
        const parts = rangeHeader.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        // If an end byte is requested, use it, otherwise go to the end of the file
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunkSize = end - start + 1

        // Create a Node.js read stream for just that specific chunk
        // @ts-ignore - Need to import createReadStream from 'fs' natively, see step 2
        const fileStream = require('fs').createReadStream(decodedPath, { start, end })

        // Convert the Node stream to a Web ReadableStream that fetch understands
        const webStream = new ReadableStream({
          start(controller) {
            fileStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
            fileStream.on('end', () => controller.close())
            fileStream.on('error', (err: Error) => controller.error(err))
          },
          cancel() {
            fileStream.destroy()
          }
        })

        // Return a 206 Partial Content response with the exact chunk dimensions
        return new Response(webStream, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': 'video/mp4' // Chromium is lenient here as long as it's media
          }
        })
      } else {
        // --- INITIAL LOAD (No Range header provided) ---
        // Just stream the whole file, but still signal that we support ranges
        // @ts-ignore
        const fileStream = require('fs').createReadStream(decodedPath)

        const webStream = new ReadableStream({
          start(controller) {
            fileStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
            fileStream.on('end', () => controller.close())
            fileStream.on('error', (err: Error) => controller.error(err))
          },
          cancel() {
            fileStream.destroy()
          }
        })

        return new Response(webStream, {
          status: 200,
          headers: {
            'Content-Length': fileSize.toString(),
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4'
          }
        })
      }
    } catch (err) {
      console.error('Local protocol error:', err)
      return new Response('Internal Server Error', { status: 500 })
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

  // --- ONLINE MEDIA SEARCH IPC ---
  ipcMain.handle('media:search-online', async (_, query: string) => {
    try {
      const response = await net.fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=15&media=all`
      )

      if (!response.ok) {
        throw new Error(`iTunes API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return data.results || []
    } catch (err) {
      console.error('Main process online search error:', err)
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
