import Joi from 'joi'

const TITLE_CONSTRAINTS = Joi.string().required().min(3).max(50)
const STATUS_CONSTRAINTS = Joi.string().valid('completed', 'not completed').required()

export const createTodoSchema = Joi.object({
  title: TITLE_CONSTRAINTS,
  status: STATUS_CONSTRAINTS,
})

export const updateTodoSchema = Joi.object({
  title: TITLE_CONSTRAINTS,
  status: STATUS_CONSTRAINTS,
})
