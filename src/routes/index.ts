import { Router } from 'express'

import { authorization, authRateLimiter, sanitizeRequestBody } from '../middleware'
import authRouter from './authRoutes'
import todoRouter from './todoRoutes'

// eslint-disable-next-line new-cap
const router = Router()

router.use(sanitizeRequestBody)

router.use('/auth', authRateLimiter, authRouter)

router.use(authorization)

router.use('/todos', todoRouter)

export default router
