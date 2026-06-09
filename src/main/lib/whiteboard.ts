import { db } from './database'

export interface Whiteboard {
  id: number
  title: string
  data: string
  createdAt: number
  updatedAt: number
}

export const whiteboardsDb = {
  getAll() {
    return db
      .prepare(
        `
      SELECT
        id,
        title,
        data,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM whiteboards
      ORDER BY updated_at DESC
    `
      )
      .all()
  },

  create(title: string, data: string) {
    return db
      .prepare(
        `
      INSERT INTO whiteboards(title, data)
      VALUES (?, ?)
    `
      )
      .run(title, data)
  },

  update(id: number, title: string, data: string) {
    return db
      .prepare(
        `
      UPDATE whiteboards
      SET
        title = ?,
        data = ?,
        updated_at = strftime('%s','now')
      WHERE id = ?
    `
      )
      .run(title, data, id)
  },

  delete(id: number) {
    return db
      .prepare(
        `
      DELETE FROM whiteboards
      WHERE id = ?
    `
      )
      .run(id)
  }
}
