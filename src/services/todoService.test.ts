import TodoService from './todoService'
import db from '../database'
import { ERROR_CODES } from '../errors/errorCodes'
import { Database } from 'better-sqlite3'

jest.mock('../database', () => ({
  prepare: jest.fn().mockReturnThis(),
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
}))

interface ExtendedDatabase extends Database {
  run: jest.Mock
  all: jest.Mock
}

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTodo', () => {
    it('should create a todo and return the new todo object', () => {
      const mockRun = (db as unknown as ExtendedDatabase).run as jest.Mock
      mockRun.mockReturnValue({ lastInsertRowid: 1, changes: 1 })

      const todo = TodoService.createTodo({
        clientId: '123',
        title: 'Test Todo',
        status: 'pending',
      })

      expect(todo).toEqual({
        id: 1,
        clientId: '123',
        title: 'Test Todo',
        status: 'pending',
      })
      expect(db.prepare).toHaveBeenCalledWith('INSERT INTO todos (client_id, title, status) VALUES (?, ?, ?)')
      expect((db as unknown as ExtendedDatabase).run).toHaveBeenCalledWith('123', 'Test Todo', 'pending')
    })
  })

  describe('getTodos', () => {
    it('should return an array of todos', () => {
      const mockAll = (db as unknown as ExtendedDatabase).all as jest.Mock
      mockAll.mockReturnValue([
        { id: 1, client_id: '123', title: 'Test Todo 1', status: 'pending' },
        { id: 2, client_id: '123', title: 'Test Todo 2', status: 'completed' },
      ])

      const todos = TodoService.getTodos('123')

      expect(todos).toEqual([
        { id: 1, clientId: '123', title: 'Test Todo 1', status: 'pending' },
        { id: 2, clientId: '123', title: 'Test Todo 2', status: 'completed' },
      ])
      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM todos WHERE client_id = ?')
      expect((db as unknown as ExtendedDatabase).all).toHaveBeenCalledWith('123')
    })
  })

  describe('updateTodoById', () => {
    const mockTodo = { id: 1, client_id: 'client123', title: 'Test Todo', status: 'pending' }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return an error if todo not found', () => {
      ;(db.prepare as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockReturnValueOnce(undefined),
      })

      const result = TodoService.updateTodoById({
        id: 1,
        clientId: 'client123',
        title: 'New Title',
        status: 'completed',
      })
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.TODO_NOT_FOUND })
    })

    it('should return an error if client ID does not match', () => {
      ;(db.prepare as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockReturnValueOnce(mockTodo),
      })

      const result = TodoService.updateTodoById({
        id: 1,
        clientId: 'wrongClient',
        title: 'New Title',
        status: 'completed',
      })
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.OWNER_MISMATCH })
    })

    it('should return an error if no changes are made', () => {
      ;(db.prepare as jest.Mock)
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValueOnce(mockTodo),
        })
        .mockReturnValueOnce({
          run: jest.fn().mockReturnValueOnce({ changes: 0 }),
        })

      const result = TodoService.updateTodoById({ id: 1, clientId: 'client123', title: 'Test Todo', status: 'pending' })
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.UPDATE_TODO.NO_CHANGES })
    })

    it('should successfully update a todo item', () => {
      ;(db.prepare as jest.Mock)
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValueOnce(mockTodo),
        })
        .mockReturnValueOnce({
          run: jest.fn().mockReturnValueOnce({ changes: 1 }),
        })

      const result = TodoService.updateTodoById({
        id: 1,
        clientId: 'client123',
        title: 'Updated Title',
        status: 'completed',
      })
      expect(result).toEqual({ id: 1, clientId: 'client123', title: 'Updated Title', status: 'completed' })
    })
  })

  describe('deleteTodoById', () => {
    const mockTodo = { id: 1, client_id: 'client123', title: 'Test Todo', status: 'pending' }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return an error if todo not found', () => {
      ;(db.prepare as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockReturnValueOnce(undefined),
      })

      const result = TodoService.deleteTodoById(1, 'client123')
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.TODO_NOT_FOUND })
    })

    it('should return an error if client ID does not match', () => {
      ;(db.prepare as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockReturnValueOnce(mockTodo),
      })

      const result = TodoService.deleteTodoById(1, 'wrongClient')
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.OWNER_MISMATCH })
    })

    it('should return an error if no changes are made', () => {
      ;(db.prepare as jest.Mock)
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValueOnce(mockTodo),
        })
        .mockReturnValueOnce({
          run: jest.fn().mockReturnValueOnce({ changes: 0 }),
        })

      const result = TodoService.deleteTodoById(1, 'client123')
      expect(result).toEqual({ error: ERROR_CODES.TODO_SERVICE.DELETE_TODO.NO_CHANGES })
    })

    it('should successfully delete a todo item', () => {
      ;(db.prepare as jest.Mock)
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValueOnce(mockTodo),
        })
        .mockReturnValueOnce({
          run: jest.fn().mockReturnValueOnce({ changes: 1 }),
        })

      const result = TodoService.deleteTodoById(1, 'client123')
      expect(result).toStrictEqual({ success: true })
    })
  })
})
