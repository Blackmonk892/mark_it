import type { Database as DatabaseType } from 'better-sqlite3'
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

const userDataPath = app.getPath('userData')
const dbPath = join(userDataPath, 'mark_it.db')

export const db: DatabaseType = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )
`
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS whiteboards (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )
`
).run()
