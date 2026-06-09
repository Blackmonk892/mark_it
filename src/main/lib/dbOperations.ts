import { notesDb } from './notes'
import { whiteboardsDb } from './whiteboard'

export const dbOperations = {
  getAllNotes: notesDb.getAll,
  saveNote: (note) => notesDb.create(note.title, note.content),
  updateNote: notesDb.update,
  deleteNote: notesDb.delete,

  getAllWhiteboards: whiteboardsDb.getAll,
  createWhiteboard: whiteboardsDb.create,
  updateWhiteboard: whiteboardsDb.update,
  deleteWhiteboard: whiteboardsDb.delete
}
