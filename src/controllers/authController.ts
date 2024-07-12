import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import { ERROR_CODES } from '../errors/errorCodes'

class AuthController {
  static async login(request: Request, response: Response) {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).send(ERROR_CODES.AUTH_CONTROLLER.LOGIN.MISSING_USERNAME_OR_PASSWORD)
    }

    const { token, error } = AuthService.login(username, password)

    if (error) {
      return response.status(401).send(error)
    }

    return response.json({ token })
  }

  static async register(request: Request, response: Response) {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).send(ERROR_CODES.AUTH_CONTROLLER.REGISTER.MISSING_USERNAME_OR_PASSWORD)
    }

    const { user, error } = AuthService.register(username, password)

    if (error) {
      return response.status(401).send(error)
    }

    return response.status(201).json(user)
  }
}

export default AuthController
