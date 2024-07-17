import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '../models/user'
import { jwtConfig } from '../config/jwtConfig'
import db from '../database'
import { ERROR_CODES } from '../errors/errorCodes'

export class AuthService {
  static login(username: string, password: string) {
    const statement = db.prepare('SELECT * FROM users WHERE username = ?')
    const user = statement.get(username) as User

    if (!user || !bcrypt.compareSync(password + user.salt, user.password)) {
      return { error: ERROR_CODES.AUTH_SERVICE.LOGIN.INVALID_USERNAME_OR_PASSWORD }
    }

    const token = jwt.sign({ username: user.username, clientId: user.client_id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    })

    return { token }
  }

  static register(username: string, password: string) {
    const statement = db.prepare('SELECT * FROM users WHERE username = ?')
    const user = statement.get(username) as User

    if (user) {
      return { error: ERROR_CODES.AUTH_SERVICE.REGISTER.USERNAME_ALREADY_REGISTERED }
    }

    const salt = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(password + salt, 8)
    const info = db
      .prepare('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)')
      .run(username, hashedPassword, salt)

    return { user: { id: info.lastInsertRowid, username } }
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, jwtConfig.secret)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
