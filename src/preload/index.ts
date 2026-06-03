import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context Isolation is not enabled. The preload script will not run.')
}

try {
  contextBridge.exposeInMainWorld('api', {
    locale: navigator.language,
    platform: process.platform,

    getAllNotes: () => ipcRenderer.invoke('db:get-all-notes'),

    saveNote: (note: { title: string; content: string }) =>
      ipcRenderer.invoke(`db:save-note`, note),

    updateNote: (id: number, title: string, content: string) =>
      ipcRenderer.invoke('db:update-note', id, title, content),

    deleteNote: (id: number) => ipcRenderer.invoke('db:delete-note', id)
  })
} catch (error) {
  console.error('Failed to expose preload APIs:', error)
}

console.log('PRELOAD STARTED')
