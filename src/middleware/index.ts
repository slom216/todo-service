import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES } from '../errors/errorCodes'
import { AuthService } from '../services/authService'
import { JwtPayload } from 'jsonwebtoken'

export const authorization = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers?.authorization

  if (!authHeader) {
    return response.status(401).send(ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.MISSING_AUTHORIZATION_HEADER)
  }

  const token = authHeader.split(' ')[1] // Bearer <token>
  try {
    const decoded = AuthService.verifyToken(token) as JwtPayload
    request.clientId = decoded.clientId
    request.user = decoded

    next()
  } catch (error) {
    return response.status(401).json(ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.INVALID_AUTHORIZATION_HEADER)
  }
}

export const asyncHandler = (fn: Function) => (request: Request, response: Response, next: NextFunction) =>
  Promise.resolve(fn(request, response, next)).catch(next)

export const errorMiddleware = (error: any, _: Request, response: Response, next: NextFunction) => {
  console.error(error)

  return response.status(500).send('Internal server error')
}
