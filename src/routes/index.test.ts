import request from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import router from './index'

const app = express()
app.use(bodyParser.json())
app.use('/todos', router)

describe('Todos API', () => {
  it('POST /todos should require authorization', async () => {
    const response = await request(app).post('/todos').send({ title: 'Test Todo', completed: false })
    expect(response.status).toBe(401)
  })

  it('GET /todos should require authorization', async () => {
    const response = await request(app).get('/todos')
    expect(response.status).toBe(401)
  })
})
