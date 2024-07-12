import db from '../database'
import { ERROR_CODES } from '../errors/errorCodes'
import { Todo } from '../models/todo'

type CreateTodoParams = {
  clientId: string | undefined
  title: string
  status: string
}

type UpdateTodoParams = {
  id: number
  clientId: string | undefined
  title: string
  status: string
}

class TodoService {
  static createTodo = ({ clientId, title, status }: CreateTodoParams) => {
    const statement = db.prepare('INSERT INTO todos (client_id, title, status) VALUES (?, ?, ?)')
    const info = statement.run(clientId, title, status)

    return { id: info.lastInsertRowid, clientId, title, status }
  }

  static getTodos = (clientId: string | undefined) => {
    const statement = db.prepare('SELECT * FROM todos WHERE client_id = ?')
    return statement
      .all(clientId)
      .map(({ id, client_id: clientId, title, status }: any) => ({ id, clientId, title, status }))
  }

  static updateTodoById = ({ id, clientId, title, status }: UpdateTodoParams) => {
    const todoStatement = db.prepare('SELECT * FROM todos WHERE id = ?')
    const todo = todoStatement.get(id) as Todo

    if (todo && todo.client_id !== clientId) {
      return { error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.OWNER_MISMATCH }
    }

    if (!todo) {
      return { error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.TODO_NOT_FOUND }
    }

    const statement = db.prepare('UPDATE todos SET title = ?, status = ? WHERE id = ? AND client_id = ?')
    const info = statement.run(title, status, id, clientId)

    if (info.changes === 0) {
      return { error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.NO_CHANGES }
    }

    return { id, clientId, title, status }
  }

  static deleteTodoById = (id: number, clientId: string | undefined) => {
    const todoStatement = db.prepare('SELECT * FROM todos WHERE id = ?')
    const todo = todoStatement.get(id) as Todo

    if (todo && todo.client_id !== clientId) {
      return { error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.OWNER_MISMATCH }
    }

    if (!todo) {
      return { error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.TODO_NOT_FOUND }
    }

    const statement = db.prepare('DELETE FROM todos WHERE id = ? AND client_id = ?')
    const info = statement.run(id, clientId)

    if (info.changes === 0) {
      return { error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.NO_CHANGES }
    }

    return { success: true }
  }
}

export default TodoService
