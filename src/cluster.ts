import cluster from 'cluster'
import os from 'os'
import https from 'https'
import fs from 'fs'
import path from 'path'

import app from './app'
import config from './config/serverConfig'

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} exited with code ${code} with signal '${signal}'. Forking a new worker...`
    )

    cluster.fork()
  })
} else {
  console.log(`Worker ${process.pid} started`)

  const key = fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'))
  const cert = fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'))

  const httpsServer = https.createServer({ key, cert }, app)

  httpsServer.listen(config.port, () => {
    console.log(`Worker is running on https://localhost:${config.port}`)
  })
}
