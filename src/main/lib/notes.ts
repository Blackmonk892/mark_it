import { db } from './database'

export interface Note {
  id: number
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export const notesDb = {
  getAll() {
    return db
      .prepare(
        `
      SELECT
        id,
        title,
        content,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM notes
      ORDER BY updated_at DESC
    `
      )
      .all()
  },

  create(title: string, content: string) {
    return db
      .prepare(
        `
      INSERT INTO notes(title, content)
      VALUES (?, ?)
    `
      )
      .run(title, content)
  },

  update(id: number, title: string, content: string) {
    return db
      .prepare(
        `
      UPDATE notes
      SET
        title = ?,
        content = ?,
        updated_at = strftime('%s','now')
      WHERE id = ?
    `
      )
      .run(title, content, id)
  },

  delete(id: number) {
    return db
      .prepare(
        `
      DELETE FROM notes
      WHERE id = ?
    `
      )
      .run(id)
  }
}
