import express, { Application } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import router from './routes'
import { errorMiddleware } from './middleware'

const app: Application = express()

app.use(helmet())

app.use(bodyParser.json())

app.use('/', router)

app.use(errorMiddleware)

export default app
