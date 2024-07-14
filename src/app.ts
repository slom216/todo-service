import express, { Application } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import router from './routes'
import { errorMiddleware } from './middleware'
import { createEventListeners } from './events/eventListeners'

const app: Application = express()

app.use(helmet())

app.use(bodyParser.json())

app.use('/', router)

app.use(errorMiddleware)

createEventListeners()

export default app
