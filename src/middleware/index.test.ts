import { NextFunction } from 'express'

import { ERROR_CODES } from '../errors/errorCodes'
import { asyncHandler, authorization, errorMiddleware } from './index'
import { AuthService } from '../services/authService'

jest.mock('../services/authService')

describe('authorization middleware', () => {
  let request: any
  let response: any
  let next: NextFunction

  beforeEach(() => {
    request = {
      headers: {},
    }
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should return 401 if authorization header is missing', () => {
    authorization(request, response, next)
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

    authorization(request, response, next)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith(
      ERROR_CODES.AUTHORIZATION_MIDDLEWARE.AUTHORIZATION.INVALID_AUTHORIZATION_HEADER
    )
  })

  it('should call next() if token is valid', () => {
    const decodedToken = { clientId: '123', user: 'testUser' }
    request.headers.authorization = 'Bearer validtoken'
    ;(AuthService.verifyToken as jest.Mock).mockReturnValue(decodedToken)

    authorization(request, response, next)
    expect(request.clientId).toEqual(decodedToken.clientId.toString())
    expect(request.user).toEqual(decodedToken)
    expect(next).toHaveBeenCalled()
  })
})

describe('asyncHandler', () => {
  let mockRequest: any
  let mockResponse: any
  let nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }
  })

  it('should handle successful async operation', async () => {
    const sampleAsyncFunction = jest.fn().mockResolvedValue('success')
    const handler = asyncHandler(sampleAsyncFunction)

    await handler(mockRequest, mockResponse, nextFunction)

    expect(sampleAsyncFunction).toHaveBeenCalledWith(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).not.toHaveBeenCalled()
  })

  it('should handle errors in async operation', async () => {
    const error = new Error('Async error')
    const sampleAsyncFunction = jest.fn().mockRejectedValue(error)
    const handler = asyncHandler(sampleAsyncFunction)

    await handler(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(error)
  })
})

describe('errorMiddleware', () => {
  let mockRequest: any
  let mockResponse: any
  let nextFunction: NextFunction = jest.fn()
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should log the error and send a 500 status with a message', () => {
    const error = new Error('Test error')

    errorMiddleware(error, mockRequest, mockResponse, nextFunction)

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.send).toHaveBeenCalledWith('Internal server error')
    expect(nextFunction).not.toHaveBeenCalled()
  })
})
