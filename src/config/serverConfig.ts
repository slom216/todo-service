import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const config = {
  jwtExpiryTime: process.env.JWT_EXPIRY_TIME ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  port: process.env.PORT ?? '',
  httpPort: process.env.HTTP_PORT ?? '',
}

export default config
