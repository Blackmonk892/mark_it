interface NotesContectType {
  notes: Note[]
  activeNote: Note | null
  isLoading: boolean
  setActiveNote: (note: Note | null) => void
  loadNotes: () => Promise<void>
  createEmptyNote: () => Promise<void>
  updateNoteContent: (title: string, content: string) => void
  deleteExistingNote: (id: number) => Promise<void>
}
