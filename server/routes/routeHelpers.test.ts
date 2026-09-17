import express from 'express'
import request from 'supertest'
import { registerViewUpdate } from './routeHelpers'

describe('registerViewUpdate', () => {
  const buildController = () => ({
    view: jest.fn((req, res) => res.status(200).send('view')),
    update: jest.fn((req, res) => res.status(200).send('update')),
  })

  it('registers a GET handler that calls controller.view', async () => {
    const app = express()
    const router = express.Router()
    const controller = buildController()

    registerViewUpdate(router, '/test-path', controller)
    app.use(router)

    const response = await request(app).get('/test-path')

    expect(response.status).toBe(200)
    expect(response.text).toBe('view')
    expect(controller.view).toHaveBeenCalledTimes(1)
    expect(controller.update).not.toHaveBeenCalled()
  })

  it('registers a POST handler that calls controller.update', async () => {
    const app = express()
    const router = express.Router()
    const controller = buildController()

    registerViewUpdate(router, '/test-path', controller)
    app.use(router)

    const response = await request(app).post('/test-path')

    expect(response.status).toBe(200)
    expect(response.text).toBe('update')
    expect(controller.update).toHaveBeenCalledTimes(1)
    expect(controller.view).not.toHaveBeenCalled()
  })

  it('forwards rejected promises from view to the error handler', async () => {
    const app = express()
    const router = express.Router()
    const error = new Error('boom')
    const controller = {
      view: jest.fn(() => Promise.reject(error)),
      update: jest.fn(),
    }

    registerViewUpdate(router, '/test-path', controller)
    app.use(router)
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(500).send(err.message)
    })

    const response = await request(app).get('/test-path')

    expect(response.status).toBe(500)
    expect(response.text).toBe('boom')
  })
})
