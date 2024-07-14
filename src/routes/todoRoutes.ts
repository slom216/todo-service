import { Router } from 'express'

import { asyncHandler, generalRateLimiter, validate } from '../middleware'
import TodoController from '../controllers/todoController'
import { createTodoSchema, updateTodoSchema } from '../validators/todoValidator'

// eslint-disable-next-line new-cap
const router = Router()

router.use(generalRateLimiter)

router.post('/', validate(createTodoSchema), asyncHandler(TodoController.createTodo))

router.get('/', asyncHandler(TodoController.getTodos))

router.put('/:id', validate(updateTodoSchema), asyncHandler(TodoController.updateTodoById))

router.delete('/:id', asyncHandler(TodoController.deleteTodoById))

export default router
