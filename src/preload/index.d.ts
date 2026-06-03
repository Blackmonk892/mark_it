declare global {
  interface Note {
    id: number
    title: string
    content: string
    createdAt: number
    updatedAt: number
  }

  interface Window {
    context: {
      locale: string
      platform: 'win32' | 'darwin' | 'linux'
      getAllNotes: () => Promise<Note[]>
      saveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
      updateNote: (id: number, title: string, content: string) => Promise<void>
      deleteNote: (id: number) => Promise<void>
    }
  }
}

export {}
