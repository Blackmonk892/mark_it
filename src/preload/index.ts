import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context Isolation is not enabled. The preload script will not run.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    platform: process.platform,

    getAllNotes: () => ipcRenderer.invoke('db:get-all-notes'),

    saveNote: (note: { title: string; content: string }) =>
      ipcRenderer.invoke(`db:save-note`, note),

    updateNote: (id: number, title: string, content: string) =>
      ipcRenderer.invoke('db:update-note', id, title, content),

    deleteNote: (id: number) => ipcRenderer.invoke('db:delete-note', id),

    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    maximizeWindow: () => ipcRenderer.send('window:maximize'),
    closeWindow: () => ipcRenderer.send('window:close'),

    //media actions
    selectLocalMediaFolder: () => ipcRenderer.invoke('media:select-folder'),

    searchOnlineMedia: (query: string) => ipcRenderer.invoke('media:search-online', query)
  })
} catch (error) {
  console.error('Failed to expose preload APIs:', error)
}

console.log('PRELOAD STARTED')
