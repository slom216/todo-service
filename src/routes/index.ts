import { Router } from 'express'

import { asyncHandler, authorization } from '../middleware'
import TodoController from '../controllers/todoController'
import AuthController from '../controllers/authController'

const router = Router()

const publicRoutes = () => {
  router.post('/auth/login', asyncHandler(AuthController.login))

  router.post('/auth/register', asyncHandler(AuthController.register))
}

const authenticatedRoutes = () => {
  router.use(authorization)

  router.post('/todos', asyncHandler(TodoController.createTodo))

  router.get('/todos', asyncHandler(TodoController.getTodos))

  router.put('/todos/:id', asyncHandler(TodoController.updateTodoById))

  router.delete('/todos/:id', asyncHandler(TodoController.deleteTodoById))
}

publicRoutes()

authenticatedRoutes()

export default router
