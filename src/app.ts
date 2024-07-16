import express, { Application } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'

import router from './routes'
import { errorMiddleware } from './middleware'
import { createEventListeners } from './events/eventListeners'

const app: Application = express()

app.use(helmet())

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (request, response) =>
      request.headers['x-no-compression'] ? false : compression.filter(request, response),
  })
)

app.use(bodyParser.json())

app.use('/', router)

app.use(errorMiddleware)

createEventListeners()

export default app
