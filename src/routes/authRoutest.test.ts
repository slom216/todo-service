import request from 'supertest'
import express, { NextFunction } from 'express'
import router from './authRoutes'

jest.mock('../middleware', () => ({
  authRateLimiter: jest.fn((_, __, next) => next()),
  asyncHandler: jest.fn(
    (fn) => (request: Request, response: Response, next: NextFunction) => fn(request, response, next).catch(next)
  ),
}))

jest.mock('../controllers/authController', () => ({
  login: jest.fn().mockImplementation((req, res) => res.status(200).send({ message: 'Logged in successfully' })),
  register: jest.fn().mockImplementation((req, res) => res.status(200).send({ message: 'Registered successfully' })),
}))

const app = express()
app.use(express.json())
app.use(router)

describe('Auth Routes', () => {
  describe('POST /login', () => {
    it('should login successfully', async () => {
      const response = await request(app).post('/login').send({ username: 'testuser', password: 'testpass' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ message: 'Logged in successfully' })
    })
  })

  describe('POST /register', () => {
    it('should register successfully', async () => {
      const response = await request(app)
        .post('/register')
        .send({ username: 'newuser', password: 'newpass', email: 'newuser@example.com' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ message: 'Registered successfully' })
    })
  })
})
