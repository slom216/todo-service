import fs from 'fs'
import https from 'https'
import path from 'path'

import app from './app'
import config from './config/serverConfig'

const key = fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'))
const cert = fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'))

const httpsServer = https.createServer({ key, cert }, app)

httpsServer.listen(config.port, () => {
  console.log(`Server is running on https://localhost:${config.port}`)
})
