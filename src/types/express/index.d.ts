// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    clientId?: string
    user?: JwtPayload
  }
}
