import type { Database as DatabaseType } from 'better-sqlite3'
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

const userDataPath = app.getPath('userData')
const dbPath = join(userDataPath, 'mark_it.dp')

export const db: DatabaseType = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
`
).run()

export interface Note {
  id: number
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export const dbOperations = {
  getAllNotes: (): Note[] => {
    const stmt = db.prepare(`
      SELECT
        id,
        title,
        content,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM notes
      ORDER BY updated_at DESC
    `)

    return stmt.all() as Note[]
  },

  saveNote: (note: Omit<Note, 'id' | 'createdAt'>): void => {
    const stmt = db.prepare(`
      INSERT INTO notes (title, content)
      VALUES ($title, $content)
      ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      updated_at = strftime('%s','now')
    `)

    stmt.run({
      title: note.title,
      content: note.content
    })
  },

  updateNote: (id: number, title: string, content: string): void => {
    const stmt = db.prepare(`
      UPDATE notes
      SET title = $title,
      content = $content,
      updated_at = strftime('%s','now')
      WHERE id = $id
    `)

    stmt.run({
      id,
      title,
      content
    })
  },

  deleteNote: (id: number): void => {
    const stmt = db.prepare(`DELETE FROM notes WHERE id = ?`)
    stmt.run(id)
  }
}
