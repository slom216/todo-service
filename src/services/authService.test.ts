import { AuthService } from './authService'
import db from '../database' // Assuming db is a module that exports the database connection
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

jest.mock('../database', () => ({
  prepare: jest.fn().mockReturnThis(),
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
}))
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('AuthService', () => {
  describe('login', () => {
    const mockUser = {
      username: 'testUser',
      password: 'hashedPassword',
      client_id: 'clientId123',
    }

    beforeAll(() => {
      ;(db.prepare as jest.Mock).mockImplementation(() => ({
        get: jest.fn().mockReturnValueOnce(mockUser),
      }))
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
      ;(jwt.sign as jest.Mock).mockReturnValue('mockToken')
    })

    it('should return a token for valid login', () => {
      const result = AuthService.login('testUser', 'correctPassword')
      expect(result).toHaveProperty('token', 'mockToken')
    })

    it('should return an error for invalid username', () => {
      ;(db.prepare as jest.Mock).mockImplementation(() => ({
        get: jest.fn().mockReturnValueOnce(undefined),
      }))
      const result = AuthService.login('wrongUser', 'correctPassword')
      expect(result).toHaveProperty('error')
    })

    it('should return an error for invalid password', () => {
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)
      const result = AuthService.login('testUser', 'wrongPassword')
      expect(result).toHaveProperty('error')
    })
  })
})
