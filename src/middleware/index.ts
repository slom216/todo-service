import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import Joi from 'joi'
import validator from 'validator'

import { ERROR_CODES } from '../errors/errorCodes'
import { AuthService } from '../services/authService'

export const authorization = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers?.authorization

  if (!authHeader) {
    return response.status(401).send(ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.MISSING_AUTHORIZATION_HEADER)
  }

  try {
    const [_, token] = authHeader.split(' ') // Bearer <token>

    const decoded = AuthService.verifyToken(token) as JwtPayload
    request.clientId = decoded.clientId
    request.user = decoded

    next()
  } catch (error) {
    return response.status(401).json(ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.INVALID_AUTHORIZATION_HEADER)
  }
}

export const asyncHandler =
  (fn: (request: Request, response: Response, next: NextFunction) => Promise<unknown>) =>
  (request: Request, response: Response, next: NextFunction) =>
    Promise.resolve(fn(request, response, next)).catch(next)

export const errorMiddleware = (error: unknown, _: Request, response: Response, __: NextFunction) => {
  console.error(error)

  return response.status(500).send('Internal server error')
}

export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  headers: true,
})

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts from this IP, please try again later',
  headers: true,
})

export const validateAndSanitize =
  (schema: Joi.ObjectSchema) => (request: Request, response: Response, next: NextFunction) => {
    const { error, value } = schema.validate(request.body)

    if (error) {
      return response.status(400).json({ error: error.details[0].message })
    }

    Object.keys(value).forEach((key) => {
      if (typeof value[key] === 'string') {
        value[key] = validator.escape(value[key])
      }
    })

    request.body = value

    next()
  }
