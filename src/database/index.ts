import Database from 'better-sqlite3'

const db = new Database('todos.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    client_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`)

export default db
