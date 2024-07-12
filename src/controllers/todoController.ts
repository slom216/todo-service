import { Request, Response } from 'express'

import { ERROR_CODES } from '../errors/errorCodes'
import TodoService from '../services/todoService'

class TodoController {
  static async createTodo(request: Request, response: Response) {
    const {
      body: { title, status },
      clientId,
    } = request

    if (!title || !status) {
      return response.status(400).send(ERROR_CODES.TODOS_CONTROLLER.CREATE_TODO.MISSING_TITLE_OR_STATUS)
    }

    const todo = TodoService.createTodo({ clientId, title, status })

    return response.status(201).json(todo)
  }

  static async getTodos(request: Request, response: Response) {
    const { clientId } = request

    const todos = TodoService.getTodos(clientId)

    return response.json(todos)
  }

  static async updateTodoById(request: Request, response: Response) {
    const {
      params: { id },
      body: { title, status },
      clientId,
    } = request

    if (!title || !status) {
      return response.status(400).send(ERROR_CODES.TODOS_CONTROLLER.UPDATE_TODO.MISSING_TITLE_OR_STATUS)
    }

    const updatedTodo = TodoService.updateTodoById({ id: Number(id), clientId, title, status })

    if (updatedTodo.error) {
      return response.status(404).send(updatedTodo.error)
    }

    return response.json(updatedTodo)
  }

  static async deleteTodoById(request: Request, response: Response) {
    const {
      params: { id },
      clientId,
    } = request

    const deletedTodo = TodoService.deleteTodoById(Number(id), clientId)

    if (deletedTodo.error) {
      return response.status(404).send(deletedTodo.error)
    }

    return response.status(204).send()
  }
}

export default TodoController
