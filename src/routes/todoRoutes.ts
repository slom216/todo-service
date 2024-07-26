import { Router } from 'express'

import { asyncHandler, generalRateLimiter, validateAndSanitize } from '../middleware'
import TodoController from '../controllers/todoController'
import { createTodoSchema, updateTodoSchema } from '../validators/todoValidator'

// eslint-disable-next-line new-cap
const router = Router()

router.use(generalRateLimiter)

router.post('/', validateAndSanitize(createTodoSchema), asyncHandler(TodoController.createTodo))

router.get('/', asyncHandler(TodoController.getTodos))

router.put('/:id', validateAndSanitize(updateTodoSchema), asyncHandler(TodoController.updateTodoById))

router.delete('/:id', asyncHandler(TodoController.deleteTodoById))

export default router
