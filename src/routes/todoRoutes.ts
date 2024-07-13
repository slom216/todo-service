import { Router } from 'express'

import { asyncHandler, generalRateLimiter } from '../middleware'
import TodoController from '../controllers/todoController'

// eslint-disable-next-line new-cap
const router = Router()

router.use(generalRateLimiter)

router.post('/', asyncHandler(TodoController.createTodo))

router.get('/', asyncHandler(TodoController.getTodos))

router.put('/:id', asyncHandler(TodoController.updateTodoById))

router.delete('/:id', asyncHandler(TodoController.deleteTodoById))

export default router
