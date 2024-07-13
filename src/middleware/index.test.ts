import { NextFunction, Request, Response } from 'express'

import { ERROR_CODES } from '../errors/errorCodes'
import { asyncHandler, authorization, errorMiddleware } from './index'
import { AuthService } from '../services/authService'

jest.mock('../services/authService')

interface TestRequest extends Partial<Request> {
  headers: Record<string, string | undefined>
  get: jest.MockedFunction<(name: 'set-cookie') => string[] | undefined> &
    jest.MockedFunction<(name: string) => string | undefined>
}

interface TestResponse extends Partial<Response> {
  status: jest.MockedFunction<(statusCode: number) => Response>
  send: jest.MockedFunction<(body?: string) => Response>
  json: jest.MockedFunction<(body?: string) => Response>
}

describe('authorization middleware', () => {
  let request: TestRequest
  let response: TestResponse
  let next: NextFunction

  beforeEach(() => {
    request = {
      headers: {},
      get: jest.fn(),
    }
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should return 401 if authorization header is missing', () => {
    authorization(request as Request, response as Response, next)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.send).toHaveBeenCalledWith(
      ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.MISSING_AUTHORIZATION_HEADER
    )
  })

  it('should return 401 if token is invalid', () => {
    request.headers.authorization = 'Bearer invalidtoken'
    ;(AuthService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    authorization(request as Request, response as Response, next)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith(
      ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.INVALID_AUTHORIZATION_HEADER
    )
  })

  it('should call next() if token is valid', () => {
    const decodedToken = { clientId: '123', user: 'testUser' }
    request.headers.authorization = 'Bearer validtoken'
    ;(AuthService.verifyToken as jest.Mock).mockReturnValue(decodedToken)

    authorization(request as Request, response as Response, next)
    expect(request.clientId).toEqual(decodedToken.clientId.toString())
    expect(request.user).toEqual(decodedToken)
    expect(next).toHaveBeenCalled()
  })
})

describe('asyncHandler', () => {
  let request: TestRequest
  let response: TestResponse
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    request = {
      headers: {},
      get: jest.fn(),
    }
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    }
  })

  it('should handle successful async operation', async () => {
    const sampleAsyncFunction = jest.fn().mockResolvedValue('success')
    const handler = asyncHandler(sampleAsyncFunction)

    await handler(request as Request, response as Response, nextFunction)

    expect(sampleAsyncFunction).toHaveBeenCalledWith(request as Request, response as Response, nextFunction)

    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('should handle errors in async operation', async () => {
    const error = new Error('Async error')
    const sampleAsyncFunction = jest.fn().mockRejectedValue(error)
    const handler = asyncHandler(sampleAsyncFunction)

    await handler(request as Request, response as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(error)
  })
})

describe('errorMiddleware', () => {
  let request: TestRequest
  let response: TestResponse
  const nextFunction: NextFunction = jest.fn()
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    request = {
      headers: {},
      get: jest.fn(),
    }
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    }
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should log the error and send a 500 status with a message', () => {
    const error = new Error('Test error')

    errorMiddleware(error, request as Request, response as Response, nextFunction)

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.send).toHaveBeenCalledWith('Internal server error')
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
