import { useContext } from 'react'
import { NotesContext } from '../store/NotesContext'

export function useNotes() {
  const context = useContext(NotesContext)

  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider')
  }

  return context
}
