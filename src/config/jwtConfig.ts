import config from './serverConfig'

export const jwtConfig = {
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiryTime,
}
