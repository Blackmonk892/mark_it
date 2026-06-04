import React, { createContext, useEffect, useRef, useState } from 'react'

export interface NotesContextType {
  notes: Note[]
  activeNote: Note | null
  isLoading: boolean
  setActiveNote: (note: Note | null) => void
  loadNotes: () => Promise<void>
  createEmptyNote: () => Promise<void>
  updateNoteContent: (title: string, content: string) => void
  deleteExistingNote: (id: number) => Promise<void>
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [activeNote, setActiveNoteState] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const activeNoteRef = useRef<Note | null>(null)

  const debounceTimer = useRef<number | null>(null)

  const loadNotes = async () => {
    try {
      setIsLoading(true)
      const allNotes = await window.context.getAllNotes()
      setNotes(allNotes)

      if (allNotes.length > 0 && !activeNoteRef.current) {
        setActiveNoteState(allNotes[0])
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const setActiveNote = (note: Note | null) => {
    if (debounceTimer.current && activeNoteRef.current) {
      clearTimeout(debounceTimer.current)
      window.context.updateNote(
        activeNoteRef.current.id,
        activeNoteRef.current.title,
        activeNoteRef.current.content
      )
    }
    activeNoteRef.current = note
    setActiveNoteState(note)
  }

  const createEmptyNote = async () => {
    try {
      await window.context.saveNote({
        title: 'Untitled Note',
        content: ''
      })

      await loadNotes()
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNoteContent = (title: string, content: string) => {
    if (!activeNote) return

    const updatedNote = {
      ...activeNote,
      title,
      content,
      updatedAt: Math.floor(Date.now() / 1000)
    }

    setActiveNoteState(updatedNote)
    activeNoteRef.current = updatedNote
    setNotes((prevNotes) => prevNotes.map((n) => (n.id === activeNote.id ? updatedNote : n)))

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    // setTimeout in renderer returns a number
    debounceTimer.current = window.setTimeout(async () => {
      try {
        await window.context.updateNote(updatedNote.id, updatedNote.title, updatedNote.content)
      } catch (error) {
        console.error('Failed to update note:', error)
      }
    }, 750)
  }

  const deleteExistingNote = async (id: number) => {
    try {
      await window.context.deleteNote(id)

      if (activeNote?.id === id) {
        setActiveNoteState(null)
      }
      await loadNotes()
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNote,
        isLoading,
        setActiveNote,
        loadNotes,
        createEmptyNote,
        updateNoteContent,
        deleteExistingNote
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
