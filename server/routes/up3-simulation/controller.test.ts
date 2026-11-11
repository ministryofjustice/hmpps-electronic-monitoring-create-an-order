import { randomUUID } from 'crypto'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import request from 'supertest'
import { csrfSync } from 'csrf-sync'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import OrderService from '../../services/orderService'
import config from '../../config'
import setupRequestParsing from '../../middleware/setupRequestParsing'
import nunjucksSetup from '../../utils/views/nunjucksSetup'
import routes from '..'
import { services } from '../../services'
import Controller, { basePath } from './controller'
import Up3SimulationService, { Up3SimulationError, Inspection, ReturnReceipt } from './service'
import { creationSchema } from './formModel'

jest.mock('../../applicationInfo')

describe('UP3 simulation controller', () => {
  const simulation = {
    availability: jest.fn(),
    inspect: jest.fn(),
    setState: jest.fn(),
    publishReturn: jest.fn(),
    returnStatus: jest.fn(),
    create: jest.fn(),
    creationStatus: jest.fn(),
  }
  const orders = { getOrder: jest.fn() }
  const controller = new Controller(simulation as unknown as Up3SimulationService, orders as unknown as OrderService)
  const orderId = randomUUID()
  const versionId = randomUUID()
  const inspection: Inspection = {
    orderId,
    currentOrderVersionId: versionId,
    currentOrderVersionNumber: 0,
    simulatedSubmissionVersionId: versionId,
    simulatedSubmissionVersionNumber: 0,
    caseId: `sim-${versionId}`,
    caseState: 'NEW',
    orderStatus: 'SUBMITTED',
    isOwner: true,
    canAmend: false,
    canControlSubmission: true,
    lastProcessedEventId: null,
    capturedUserEmails: 0,
    capturedNoEmails: 0,
  }
  let req: Request
  let res: Response

  const rendered = () => (res.render as jest.Mock).mock.calls.at(-1)[1]
  const receipt = (eventId: string, status: ReturnReceipt['status'] = 'QUEUED'): ReturnReceipt => ({
    eventId,
    orderId,
    targetOrderVersionId: versionId,
    simulatedSubmissionVersionId: versionId,
    status,
    createdAt: new Date().toISOString(),
    queuedAt: null,
    completedAt: null,
    publicationAttempts: 1,
    processingFailures: 0,
    nextPublicationAttemptAt: null,
    failureStage: null,
    errorCode: null,
  })

  beforeEach(() => {
    jest.resetAllMocks()
    req = createMockRequest({ params: { orderId }, body: {} })
    req.session.save = jest.fn(callback => {
      callback?.(null)
      return req.session
    })
    res = createMockResponse()
    res.status = jest.fn().mockReturnValue(res)
    simulation.availability.mockResolvedValue({ available: true, code: 'UP3_SIMULATION_AVAILABLE' })
    simulation.inspect.mockResolvedValue(inspection)
    orders.getOrder.mockResolvedValue(getMockOrder({ id: orderId, versionId, status: 'SUBMITTED', isOwner: true }))
  })

  it.each(['uuid', 'http://localhost:8080/api/orders/', '/api/orders/'])(
    'selects the current order from %s without calling an API',
    async prefix => {
      req.body = { orderId: prefix === 'uuid' ? ` ${orderId} ` : `${prefix}${orderId}` }
      await controller.selectOrder(req, res)
      expect(res.redirect).toHaveBeenCalledWith(`${basePath}/orders/${orderId}`)
      expect(orders.getOrder).not.toHaveBeenCalled()
      expect(simulation.setState).not.toHaveBeenCalled()
    },
  )

  it.each([
    'not-a-uuid',
    `/api/orders/${orderId}?versionId=${versionId}`,
    `/api/orders/${orderId}/versions/${versionId}`,
    `/api/orders/${orderId}#historic`,
    `file:///api/orders/${orderId}`,
  ])('rejects an invalid or historical lookup %s', async orderInput => {
    req.body = { orderId: orderInput }
    await controller.selectOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('inspection does not write or disclose the user token', async () => {
    await controller.inspect(req, res)
    expect(rendered()).toMatchObject({ mode: 'order', simulation: inspection })
    expect(simulation.setState).not.toHaveBeenCalled()
    expect(JSON.stringify(rendered())).not.toContain('fakeUserToken')
  })

  it('requires ownership before inspection', async () => {
    orders.getOrder.mockResolvedValue(getMockOrder({ id: orderId, isOwner: false }))
    await controller.inspect(req, res)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(simulation.inspect).not.toHaveBeenCalled()
  })

  it('distinguishes not enrolled from disabled', async () => {
    simulation.inspect.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_NOT_ENROLLED', 404))
    await controller.inspect(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(rendered()).toMatchObject({
      mode: 'error',
      errorCode: 'UP3_SIMULATION_NOT_ENROLLED',
      errorMessage: expect.stringContaining('This order is not simulated'),
    })
    simulation.availability.mockResolvedValue({ available: false, code: 'UP3_SIMULATION_DISABLED' })
    await controller.inspect(req, res)
    expect(rendered()).toMatchObject({ mode: 'error', errorCode: 'UP3_SIMULATION_DISABLED' })
  })

  it('retains stale displayed UUIDs rather than substituting the latest order version', async () => {
    const oldVersion = randomUUID()
    req.body = {
      state: 'ACCEPTED',
      expectedCurrentOrderVersionId: oldVersion,
      expectedSimulatedSubmissionVersionId: oldVersion,
    }
    simulation.setState.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_STALE_VERSION', 409))
    await controller.setState(req, res)
    expect(simulation.setState).toHaveBeenCalledWith('fakeUserToken', orderId, req.body)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(rendered().orderUrl).toBe(`${basePath}/orders/${orderId}`)
  })

  it('retains one return payload through a timeout and explicit retry', async () => {
    await controller.returnForm(req, res)
    const { eventId } = rendered()
    req.body = {
      eventId,
      expectedCurrentOrderVersionId: versionId,
      expectedSimulatedSubmissionVersionId: versionId,
      reasons: [{ section: 'other', details: 'Missing signature' }],
    }
    simulation.publishReturn.mockRejectedValueOnce(new Up3SimulationError('UP3_SIMULATION_UNAVAILABLE', 504))
    await controller.publishReturn(req, res)
    const original = simulation.publishReturn.mock.calls[0][2]
    expect(req.session.save).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`${basePath}/orders/${orderId}/returns/${eventId}`)
    req.params.eventId = eventId
    simulation.publishReturn.mockResolvedValue(receipt(eventId))
    await controller.retryReturn(req, res)
    expect(simulation.publishReturn.mock.calls[1][2]).toEqual(original)
  })

  it.each(['PENDING_PUBLICATION', 'QUEUED', 'FAILED', 'STALE_IGNORED', 'PROCESSED'] as const)(
    'tracks the exact event with status %s without another publication',
    async status => {
      const eventId = randomUUID()
      req.params.eventId = eventId
      simulation.returnStatus.mockResolvedValue(receipt(eventId, status))
      await controller.returnStatus(req, res)
      expect(simulation.returnStatus).toHaveBeenCalledWith('fakeUserToken', orderId, eventId)
      expect(rendered().receipt.status).toBe(status)
      expect(simulation.publishReturn).not.toHaveBeenCalled()
    },
  )

  it('offers a complete synthetic DTO only when requested without creating an order', async () => {
    await controller.createForm(req, res)
    expect(rendered().orderJson).toBeUndefined()
    req.query = { example: 'true' }
    await controller.createForm(req, res)
    const form = rendered()
    const example = JSON.parse(form.orderJson)
    expect(creationSchema.safeParse({ ...form, reasons: [] }).success).toBe(true)
    expect(example).toMatchObject({
      username: 'IGNORED_EXAMPLE_SOURCE_OWNER',
      curfewTimeTable: [],
      deviceWearer: { versionId: example.versionId, firstName: 'UP3', lastName: 'Smoke Test' },
      monitoringConditions: { versionId: example.versionId, trail: true },
      additionalDocuments: [],
    })
    expect(new Date(example.monitoringConditions.startDate).getTime()).toBeGreaterThan(Date.now())
    expect(new Date(example.monitoringConditions.endDate).getTime()).toBeGreaterThan(
      new Date(example.monitoringConditions.startDate).getTime(),
    )
    expect(simulation.create).not.toHaveBeenCalled()
  })

  it('recovers creation timeouts without automatically creating again', async () => {
    await controller.createForm(req, res)
    const { creationRequestId } = rendered()
    req.body = { creationRequestId, state: 'DRAFT', orderJson: '{"deviceWearer":{}}' }
    simulation.create.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_UNAVAILABLE', 504))
    await controller.create(req, res)
    expect(res.redirect).toHaveBeenCalledWith(`${basePath}/creations/${creationRequestId}`)
    const original = simulation.create.mock.calls[0][1]
    req.params.creationRequestId = creationRequestId
    simulation.creationStatus.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_CREATION_NOT_FOUND', 404))
    await controller.creationStatus(req, res)
    expect(simulation.create).toHaveBeenCalledTimes(1)
    await controller.resumeCreation(req, res)
    expect(simulation.create.mock.calls[1][1]).toEqual(original)
  })

  it('rejects changed data under an existing creation identity', async () => {
    await controller.createForm(req, res)
    const { creationRequestId } = rendered()
    req.body = { creationRequestId, state: 'DRAFT', orderJson: '{"deviceWearer":{}}' }
    simulation.create.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_UNAVAILABLE', 504))
    await controller.create(req, res)
    req.body.orderJson = '{"deviceWearer":{"firstName":"Changed"}}'
    await controller.create(req, res)
    expect(simulation.create).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(409)
  })

  it.each(['DRAFT', 'PROCESSING', 'ACCEPTED', 'RETURNED'] as const)(
    'creates %s using the preallocated identity and normal API DTO',
    async state => {
      await controller.createForm(req, res)
      const { creationRequestId } = rendered()
      req.body = {
        creationRequestId,
        state,
        orderJson: '{"deviceWearer":{}}',
        reasons: state === 'RETURNED' ? [{ section: 'other', details: 'Missing signature' }] : [],
      }
      simulation.create.mockResolvedValue({ creationRequestId, simulation: inspection, returnEventId: null })
      await controller.create(req, res)
      expect(simulation.create).toHaveBeenCalledWith(
        'fakeUserToken',
        expect.objectContaining({
          creationRequestId,
          state,
          order: { deviceWearer: {} },
        }),
      )
      expect(req.session.up3Simulation?.creations[creationRequestId].completed).toBe(true)
    },
  )

  it('prevents controls targeting a previous submission while a newer draft exists', async () => {
    simulation.inspect.mockResolvedValue({ ...inspection, canControlSubmission: false, orderStatus: 'IN_PROGRESS' })
    await controller.returnForm(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(simulation.publishReturn).not.toHaveBeenCalled()
  })

  it('blocks a second tab from publishing a new return while retaining the original replay', async () => {
    await controller.returnForm(req, res)
    const firstId = rendered().eventId
    await controller.returnForm(req, res)
    const secondId = rendered().eventId
    req.body = {
      eventId: firstId,
      expectedCurrentOrderVersionId: versionId,
      expectedSimulatedSubmissionVersionId: versionId,
      reasons: [{ section: 'other', details: 'Missing signature' }],
    }
    simulation.publishReturn.mockResolvedValue(receipt(firstId))
    await controller.publishReturn(req, res)
    req.body.eventId = secondId
    await controller.publishReturn(req, res)
    expect(simulation.publishReturn).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(409)
    req.body.eventId = firstId
    await controller.publishReturn(req, res)
    expect(simulation.publishReturn).toHaveBeenCalledTimes(2)
  })

  it('keeps a quick-created return pending until its event-specific receipt is terminal', async () => {
    await controller.createForm(req, res)
    const { creationRequestId } = rendered()
    const eventId = randomUUID()
    req.body = {
      creationRequestId,
      state: 'RETURNED',
      orderJson: '{"deviceWearer":{}}',
      reasons: [{ section: 'name', details: '' }],
    }
    simulation.create.mockResolvedValue({ creationRequestId, simulation: inspection, returnEventId: eventId })
    await controller.create(req, res)
    simulation.returnStatus.mockResolvedValue(receipt(eventId))
    await controller.inspect(req, res)
    expect(rendered()).toMatchObject({ pendingReturn: true, eventId })
    simulation.returnStatus.mockResolvedValue(receipt(eventId, 'PROCESSED'))
    await controller.inspect(req, res)
    expect(rendered().pendingReturn).toBe(false)
  })

  describe('HTTP security boundaries', () => {
    const originalEnabled = config.up3Simulation.enabled
    const headers = { Authorization: 'Bearer test-user' }
    const app = (enabled = true) => {
      config.up3Simulation.enabled = enabled
      const application = express()
      nunjucksSetup(application)
      application.use(setupRequestParsing())
      application.use(session({ secret: 'test-session-secret', resave: false, saveUninitialized: false }))
      application.use((incoming, outgoing, next) => {
        if (incoming.headers.authorization !== headers.Authorization) {
          outgoing.sendStatus(401)
          return
        }
        Object.assign(outgoing.locals, createMockResponse().locals)
        next()
      })
      const { csrfSynchronisedProtection } = csrfSync({
        getTokenFromRequest: incoming => Reflect.get(incoming.body, '_csrf'),
      })
      application.use(csrfSynchronisedProtection)
      application.use((incoming, outgoing, next) => {
        Object.assign(outgoing.locals, { csrfToken: incoming.csrfToken?.() })
        next()
      })
      application.get('/csrf', (incoming, outgoing) => outgoing.json({ token: incoming.csrfToken?.() }))
      const dependencies = {
        ...services(),
        up3SimulationService: simulation as unknown as Up3SimulationService,
        orderService: orders as unknown as OrderService,
      }
      application.use(routes(dependencies))
      application.use((error: { status?: number }, _incoming: Request, outgoing: Response, _next: NextFunction) => {
        outgoing.sendStatus(error.status ?? 500)
      })
      return application
    }

    afterEach(() => {
      config.up3Simulation.enabled = originalEnabled
    })

    it('constructs the simulator service in the production service factory', () => {
      expect(Reflect.get(services(), 'up3SimulationService')).toBeInstanceOf(Up3SimulationService)
    })

    it('mounts the simulator entry page in the production router when enabled', async () => {
      await request(app()).get(basePath).set(headers).expect(200)
      expect(simulation.availability).toHaveBeenCalledWith('fakeUserToken')
    })

    it('returns 404 for disabled GET and valid-CSRF POST routes without calling the API', async () => {
      const agent = request.agent(app(false))
      const { token } = (await agent.get('/csrf').set(headers)).body
      await agent.get(basePath).set(headers).expect(404)
      await agent
        .post(`${basePath}/orders/${orderId}/state`)
        .set(headers)
        .type('form')
        .send({ _csrf: token, state: 'ACCEPTED' })
        .expect(404)
      expect(simulation.availability).not.toHaveBeenCalled()
      expect(simulation.setState).not.toHaveBeenCalled()
    })

    it('rejects ordinary orders and returns 404 for the removed enrollment POST even with valid CSRF', async () => {
      const agent = request.agent(app())
      const { token } = (await agent.get('/csrf').set(headers)).body
      simulation.inspect.mockRejectedValue(new Up3SimulationError('UP3_SIMULATION_NOT_ENROLLED', 404))
      const response = await agent.get(`${basePath}/orders/${orderId}`).set(headers).expect(404)
      expect(response.text).toContain('This order is not simulated')
      expect(response.text).not.toContain('Enrol order')
      expect(response.text).not.toContain('name="confirmation"')
      expect(response.text).not.toContain('Set processing')
      expect(response.text).not.toContain('Return order')
      await agent
        .post(`${basePath}/orders/${orderId}/enrol`)
        .set(headers)
        .type('form')
        .send({ _csrf: token, confirmation: 'yes', expectedCurrentOrderVersionId: versionId })
        .expect(404)
      expect(simulation.setState).not.toHaveBeenCalled()
      expect(simulation.publishReturn).not.toHaveBeenCalled()
    })

    it('requires authentication and genuine CSRF before a state command', async () => {
      const application = app()
      await request(application).get(basePath).expect(401)
      const agent = request.agent(application)
      const { token } = (await agent.get('/csrf').set(headers)).body
      await agent
        .post(`${basePath}/orders/${orderId}/state`)
        .set(headers)
        .type('form')
        .send({ state: 'ACCEPTED' })
        .expect(403)
      expect(simulation.setState).not.toHaveBeenCalled()
      await agent
        .post(`${basePath}/orders/${orderId}/state`)
        .set(headers)
        .type('form')
        .send({
          _csrf: token,
          state: 'ACCEPTED',
          expectedCurrentOrderVersionId: versionId,
          expectedSimulatedSubmissionVersionId: versionId,
        })
        .expect(302)
      expect(simulation.setState).toHaveBeenCalledWith(
        'fakeUserToken',
        orderId,
        expect.objectContaining({
          expectedCurrentOrderVersionId: versionId,
          expectedSimulatedSubmissionVersionId: versionId,
        }),
      )
    })

    it('renders controls without disclosing credentials and removes them for a newer draft', async () => {
      const application = app()
      const response = await request(application).get(`${basePath}/orders/${orderId}`).set(headers).expect(200)
      expect(response.headers['cache-control']).toBe('no-store')
      expect(response.text).toContain('Set accepted')
      expect(response.text).not.toContain('fakeUserToken')
      expect(response.text).not.toContain('fakeUserToken')
      const newerVersionId = randomUUID()
      simulation.inspect.mockResolvedValue({
        ...inspection,
        currentOrderVersionId: newerVersionId,
        orderStatus: 'IN_PROGRESS',
        canControlSubmission: false,
      })
      const draft = await request(application).get(`${basePath}/orders/${orderId}`).set(headers).expect(200)
      expect(draft.text).toContain(newerVersionId)
      expect(draft.text).toContain('This is an editable draft')
      expect(draft.text).not.toContain('Set accepted')
      expect(draft.text).not.toContain('Return order')
    })

    it('renders an accessible 413 for an oversized simulator form without raising ordinary limits', async () => {
      const application = app()
      const oversized = await request(application)
        .post(`${basePath}/create`)
        .set(headers)
        .type('form')
        .send({ orderJson: 'a'.repeat(1024 * 1024) })
        .expect(413)
      expect(oversized.text).toContain('The simulator form is too large')
      expect(simulation.create).not.toHaveBeenCalled()
      await request(application)
        .post('/ordinary-route')
        .set(headers)
        .type('form')
        .send({ data: 'a'.repeat(110 * 1024) })
        .expect(413)
    })
  })
})
