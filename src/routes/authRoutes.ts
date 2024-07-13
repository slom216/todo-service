import { Router } from 'express'

import { asyncHandler, authRateLimiter } from '../middleware'
import AuthController from '../controllers/authController'

// eslint-disable-next-line new-cap
const router = Router()

router.use(authRateLimiter)

router.post('/login', asyncHandler(AuthController.login))

router.post('/register', asyncHandler(AuthController.register))

export default router
