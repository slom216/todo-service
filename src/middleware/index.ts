import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES } from '../errors/errorCodes'
import { AuthService } from '../services/authService'
import { JwtPayload } from 'jsonwebtoken'

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
