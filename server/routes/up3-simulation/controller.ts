import { randomUUID } from 'crypto'
import { Request, Response } from 'express'
import { validate } from 'uuid'
import z from 'zod'
import OrderService from '../../services/orderService'
import { creationSchema, returnSchema, stateSchema } from './formModel'
import Up3SimulationService, { CreationCommand, ReturnCommand, ReturnReceipt, Up3SimulationError } from './service'
import createExampleOrder from './exampleOrder'

export const basePath = '/dev/up3-simulation'
type ReturnIntent = {
  orderId: string
  createdAt: number
  command?: ReturnCommand
  receipt?: ReturnReceipt
  tracked?: boolean
}
type CreationIntent = {
  createdAt: number
  command?: CreationCommand
  completed?: boolean
  validationErrors?: { text: string; href: string }[]
}
export type SimulationSession = {
  returns: Record<string, ReturnIntent>
  creations: Record<string, CreationIntent>
}

const messages: Record<string, string> = {
  UP3_SIMULATION_DISABLED: 'UP3 simulation is switched off in the API.',
  UP3_SIMULATION_PERMISSION_DENIED: 'You do not have permission to control this order.',
  UP3_SIMULATION_ORDER_NOT_FOUND: 'This order could not be found.',
  UP3_SIMULATION_NOT_ENROLLED:
    'This order is not simulated. Create a synthetic test order or load an already simulated order.',
  UP3_SIMULATION_STALE_VERSION: 'The order version has changed. Refresh and choose the action again.',
  UP3_SIMULATION_NOT_SUBMITTED: 'The current version is not submitted. Use the normal order page to submit it.',
  UP3_SIMULATION_NO_CASE: 'There is no simulated submission to control yet.',
  UP3_SIMULATION_WRONG_CASE: 'This order does not have the expected simulated case.',
  UP3_SIMULATION_EVENT_NOT_FOUND:
    'No return receipt is visible yet. Refresh or deliberately retry the original return.',
  UP3_SIMULATION_CREATION_NOT_FOUND: 'No creation reservation is visible yet. Refresh or resume the original request.',
  UP3_SIMULATION_CREATED_ORDER_REMOVED: 'The original created order was deleted. It will not be recreated.',
  UP3_SIMULATION_EVENT_ID_CONFLICT: 'This return identity already belongs to a different payload. Start a new intent.',
  UP3_SIMULATION_CREATION_ID_CONFLICT:
    'This creation identity already belongs to a different payload. Start a new intent.',
  UP3_SIMULATION_ID_CONFLICT: 'The original request identity or payload no longer matches. Start a new intent.',
  UP3_SIMULATION_PENDING: 'A return is still pending or unknown. Refresh its receipt before choosing another action.',
  UP3_SIMULATION_TOO_MANY_REQUESTS:
    'There are too many retained requests in this session. Finish the pending requests first.',
}

export default class Up3SimulationController {
  constructor(
    private readonly simulationService: Up3SimulationService,
    private readonly orderService: OrderService,
  ) {}

  private session(req: Request): SimulationSession {
    req.session.up3Simulation ??= { returns: {}, creations: {} }
    return req.session.up3Simulation
  }

  private reserve<T extends ReturnIntent | CreationIntent>(intents: Record<string, T>, id: string, intent: T) {
    if (Object.keys(intents).length >= 20) {
      const disposable = Object.entries(intents)
        .sort(([, first], [, second]) => first.createdAt - second.createdAt)
        .find(
          ([, value]) =>
            (!value.command && !('tracked' in value && value.tracked)) ||
            ('completed' in value && value.completed) ||
            ('receipt' in value && ['PROCESSED', 'STALE_IGNORED'].includes(value.receipt?.status ?? '')),
        )
      if (disposable) Reflect.deleteProperty(intents, disposable[0])
    }
    if (Object.keys(intents).length >= 20) throw new Up3SimulationError('UP3_SIMULATION_TOO_MANY_REQUESTS', 429)
    Object.assign(intents, { [id]: intent })
  }

  private save(req: Request) {
    return new Promise<void>((resolve, reject) => {
      req.session.save(error => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  private render(res: Response, mode: string, values: Record<string, unknown> = {}) {
    res.set('Cache-Control', 'no-store')
    res.render('pages/up3-simulation', { pageTitle: 'Dev: simulate UP3', basePath, mode, ...values })
  }

  private async available(res: Response) {
    const availability = await this.simulationService.availability(res.locals.user.token)
    if (!availability.available)
      throw new Up3SimulationError(
        availability.code === 'UP3_SIMULATION_DISABLED' ? availability.code : 'UP3_SIMULATION_UNAVAILABLE',
        503,
      )
  }

  private orderId(req: Request) {
    const id = req.params.orderId as string
    if (!validate(id)) throw new Up3SimulationError('UP3_SIMULATION_ORDER_NOT_FOUND', 404)
    return id
  }

  private async ownedOrder(req: Request, res: Response) {
    const order = await this.orderService.getOrder({ orderId: this.orderId(req), accessToken: res.locals.user.token })
    if (!order.isOwner) throw new Up3SimulationError('UP3_SIMULATION_PERMISSION_DENIED', 403)
    res.locals.up3OrderUrl = `${basePath}/orders/${order.id}`
    return order
  }

  private errors(error: z.ZodError) {
    return error.issues.map(issue => ({
      text: issue.message,
      href: ['orderId', 'orderJson', 'reasons'].includes(String(issue.path[0]))
        ? `#${String(issue.path[0])}`
        : '#main-content',
    }))
  }

  private reasons(body: Record<string, unknown>) {
    const reasons = Array.isArray(body.reasons) ? body.reasons : []
    return reasons.filter(
      reason => reason && (String(reason.section ?? '').trim() || String(reason.details ?? '').trim()),
    )
  }

  private pending(intent?: ReturnIntent) {
    return Boolean(
      (intent?.command || intent?.tracked) &&
      (!intent.receipt || !['PROCESSED', 'STALE_IGNORED'].includes(intent.receipt.status)),
    )
  }

  private latestReturn(req: Request, orderId: string) {
    return Object.entries(this.session(req).returns)
      .filter(([, intent]) => intent.orderId === orderId && (intent.command || intent.tracked))
      .sort(([, first], [, second]) => second.createdAt - first.createdAt)[0]
  }

  private async guarded(res: Response, operation: () => Promise<void>) {
    try {
      await operation()
    } catch (error) {
      if (!(error instanceof Up3SimulationError)) throw error
      if (error.status === 401) throw error
      this.render(res.status(error.status), 'error', {
        errorMessage:
          messages[error.code] ??
          (error.status === 400
            ? 'The API rejected the supplied fields. Start a new intent to correct them; an existing identity cannot change payload.'
            : 'UP3 simulation is unavailable or its result is unknown. Retain the original request identity and use recovery.'),
        errorCode: error.code,
        errors: error.fieldErrors,
        recoveryUrl: res.locals.up3RecoveryUrl,
        orderUrl: res.locals.up3OrderUrl,
      })
    }
  }

  entry = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      this.render(res, 'entry')
    })

  selectOrder = async (req: Request, res: Response) => {
    const orderInput = String(req.body.orderId ?? '').trim()
    let orderId = orderInput
    if (!validate(orderId)) {
      try {
        const url = new URL(orderInput, 'http://localhost')
        const segments = url.pathname.split('/').filter(Boolean)
        if (
          ['http:', 'https:'].includes(url.protocol) &&
          !url.search &&
          !url.hash &&
          segments.length === 3 &&
          segments[0] === 'api' &&
          segments[1] === 'orders'
        ) {
          const [, , selectedOrderId] = segments
          orderId = selectedOrderId
        }
      } catch {
        orderId = ''
      }
    }
    if (!validate(orderId)) {
      this.render(res.status(400), 'entry', {
        orderId: orderInput,
        errors: [{ text: 'Enter a valid order UUID or current-order /api/orders/{uuid} URL', href: '#orderId' }],
      })
      return
    }
    res.redirect(`${basePath}/orders/${orderId}`)
  }

  inspect = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      const order = await this.ownedOrder(req, res)
      const simulation = await this.simulationService.inspect(res.locals.user.token, order.id)
      const latest = this.latestReturn(req, order.id)
      if (latest) {
        try {
          latest[1].receipt = await this.simulationService.returnStatus(res.locals.user.token, order.id, latest[0])
        } catch (error) {
          if (
            !(error instanceof Up3SimulationError) ||
            !['UP3_SIMULATION_EVENT_NOT_FOUND', 'UP3_SIMULATION_UNAVAILABLE'].includes(error.code)
          )
            throw error
          latest[1].receipt = undefined
        }
      }
      this.render(res, 'order', {
        order,
        simulation,
        pendingReturn: latest && this.pending(latest[1]),
        eventId: latest?.[0],
        summaryUrl: `/order/${order.id}/summary`,
      })
    })

  setState = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      const order = await this.ownedOrder(req, res)
      if (this.pending(this.latestReturn(req, order.id)?.[1]))
        throw new Up3SimulationError('UP3_SIMULATION_PENDING', 409)
      const parsed = stateSchema.safeParse(req.body)
      if (!parsed.success) {
        this.render(res.status(400), 'error', { errors: this.errors(parsed.error) })
        return
      }
      await this.simulationService.setState(res.locals.user.token, order.id, parsed.data)
      res.redirect(`${basePath}/orders/${order.id}`)
    })

  returnForm = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      const order = await this.ownedOrder(req, res)
      const simulation = await this.simulationService.inspect(res.locals.user.token, order.id)
      if (!simulation.canControlSubmission || this.pending(this.latestReturn(req, order.id)?.[1])) {
        throw new Up3SimulationError('UP3_SIMULATION_NOT_SUBMITTED', 409)
      }
      const eventId = randomUUID()
      this.reserve(this.session(req).returns, eventId, { orderId: order.id, createdAt: Date.now() })
      this.render(res, 'return', {
        order,
        simulation,
        eventId,
        reasons: [{}],
        formAction: `${basePath}/orders/${order.id}/return`,
      })
    })

  publishReturn = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      const orderId = this.orderId(req)
      await this.ownedOrder(req, res)
      const intent = this.session(req).returns[String(req.body.eventId)]
      if (!intent || intent.orderId !== orderId) throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 409)
      if (!intent.command && this.pending(this.latestReturn(req, orderId)?.[1]))
        throw new Up3SimulationError('UP3_SIMULATION_PENDING', 409)
      const values = {
        ...req.body,
        reasons: this.reasons(req.body),
        formAction: `${basePath}/orders/${orderId}/return`,
      }
      if (req.body.action === 'addReason' && !intent.command) {
        if (values.reasons.length >= 50) throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 400)
        this.render(res, 'return', { ...values, reasons: [...values.reasons, {}] })
        return
      }
      const parsed = returnSchema.safeParse(values)
      if (!parsed.success) {
        this.render(res.status(400), 'return', { ...values, errors: this.errors(parsed.error) })
        return
      }
      const command = intent.command ?? { ...parsed.data, datetimeOfStatusChange: new Date().toISOString() }
      if (
        intent.command &&
        JSON.stringify({ ...parsed.data, datetimeOfStatusChange: command.datetimeOfStatusChange }) !==
          JSON.stringify(command)
      )
        throw new Up3SimulationError('UP3_SIMULATION_EVENT_ID_CONFLICT', 409)
      intent.command = command
      res.locals.up3RecoveryUrl = `${basePath}/orders/${orderId}/returns/${command.eventId}`
      await this.save(req)
      try {
        intent.receipt = await this.simulationService.publishReturn(res.locals.user.token, orderId, command)
      } catch (error) {
        if (!(error instanceof Up3SimulationError)) throw error
        if (![502, 503, 504].includes(error.status)) throw error
      }
      res.redirect(`${basePath}/orders/${orderId}/returns/${command.eventId}`)
    })

  returnStatus = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      await this.ownedOrder(req, res)
      const orderId = this.orderId(req)
      const eventId = String(req.params.eventId)
      if (!validate(eventId)) throw new Up3SimulationError('UP3_SIMULATION_EVENT_NOT_FOUND', 404)
      const intent = this.session(req).returns[eventId]
      let receipt
      let statusMessage
      try {
        receipt = await this.simulationService.returnStatus(res.locals.user.token, orderId, eventId)
        if (intent?.orderId === orderId) intent.receipt = receipt
      } catch (error) {
        if (
          !(error instanceof Up3SimulationError) ||
          !['UP3_SIMULATION_EVENT_NOT_FOUND', 'UP3_SIMULATION_UNAVAILABLE'].includes(error.code)
        )
          throw error
        statusMessage =
          messages[error.code] ?? 'The return result is still pending or unknown. Refresh; do not create another event.'
      }
      this.render(res, 'return-status', { orderId, eventId, receipt, statusMessage, retryCommand: intent?.command })
    })

  retryReturn = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      const orderId = this.orderId(req)
      await this.ownedOrder(req, res)
      const eventId = String(req.params.eventId)
      const intent = this.session(req).returns[eventId]
      if (!intent?.command || intent.orderId !== orderId)
        throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 409)
      res.locals.up3RecoveryUrl = `${basePath}/orders/${orderId}/returns/${eventId}`
      await this.save(req)
      try {
        intent.receipt = await this.simulationService.publishReturn(res.locals.user.token, orderId, intent.command)
      } catch (error) {
        if (!(error instanceof Up3SimulationError) || ![502, 503, 504].includes(error.status)) throw error
      }
      res.redirect(`${basePath}/orders/${orderId}/returns/${eventId}`)
    })

  createForm = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      const creationRequestId = randomUUID()
      this.reserve(this.session(req).creations, creationRequestId, { createdAt: Date.now() })
      this.render(res, 'create', {
        creationRequestId,
        state: 'DRAFT',
        reasons: [{}],
        ...(req.query.example === 'true' && { orderJson: JSON.stringify(createExampleOrder(), null, 2) }),
      })
    })

  create = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      const intent = this.session(req).creations[String(req.body.creationRequestId)]
      if (!intent) throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 409)
      const values = { ...req.body, reasons: this.reasons(req.body) }
      if (req.body.action === 'addReason' && !intent.command) {
        if (values.reasons.length >= 50) throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 400)
        this.render(res, 'create', { ...values, reasons: [...values.reasons, {}] })
        return
      }
      const parsed = creationSchema.safeParse(values)
      if (!parsed.success) {
        this.render(res.status(400), 'create', { ...values, errors: this.errors(parsed.error) })
        return
      }
      const command: CreationCommand = {
        creationRequestId: parsed.data.creationRequestId,
        order: parsed.data.orderJson,
        state: parsed.data.state,
        ...(parsed.data.state === 'RETURNED' && { reasons: parsed.data.reasons }),
      }
      if (intent.command && JSON.stringify(intent.command) !== JSON.stringify(command)) {
        throw new Up3SimulationError('UP3_SIMULATION_CREATION_ID_CONFLICT', 409)
      }
      intent.command = command
      await this.save(req)
      await this.createRequest(req, res, command)
    })

  private async createRequest(req: Request, res: Response, command: CreationCommand) {
    res.locals.up3RecoveryUrl = `${basePath}/creations/${command.creationRequestId}`
    try {
      const result = await this.simulationService.create(res.locals.user.token, command)
      this.session(req).creations[command.creationRequestId].completed = true
      if (result.returnEventId) {
        this.trackReturn(req, result.simulation.orderId, result.returnEventId)
      }
      res.redirect(
        result.returnEventId
          ? `${basePath}/orders/${result.simulation.orderId}/returns/${result.returnEventId}`
          : `${basePath}/orders/${result.simulation.orderId}`,
      )
    } catch (error) {
      if (!(error instanceof Up3SimulationError)) throw error
      if (![400, 502, 503, 504].includes(error.status)) throw error
      if (error.status === 400) {
        this.session(req).creations[command.creationRequestId].validationErrors = error.fieldErrors.length
          ? error.fieldErrors
          : [
              {
                text: 'The API rejected the supplied order data. Start a new intent to correct it.',
                href: '#main-content',
              },
            ]
      }
      res.redirect(`${basePath}/creations/${command.creationRequestId}`)
    }
  }

  private trackReturn(req: Request, orderId: string, eventId: string) {
    if (!this.session(req).returns[eventId]) {
      this.reserve(this.session(req).returns, eventId, { orderId, createdAt: Date.now(), tracked: true })
    }
  }

  creationStatus = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      await this.available(res)
      const creationRequestId = String(req.params.creationRequestId)
      if (!validate(creationRequestId)) throw new Up3SimulationError('UP3_SIMULATION_CREATION_NOT_FOUND', 404)
      let receipt
      let statusMessage
      try {
        receipt = await this.simulationService.creationStatus(res.locals.user.token, creationRequestId)
        if (receipt.status === 'CREATED' && receipt.orderId) {
          const intent = this.session(req).creations[creationRequestId]
          if (intent) intent.completed = true
          if (receipt.returnEventId) this.trackReturn(req, receipt.orderId, receipt.returnEventId)
          res.redirect(
            receipt.returnEventId
              ? `${basePath}/orders/${receipt.orderId}/returns/${receipt.returnEventId}`
              : `${basePath}/orders/${receipt.orderId}`,
          )
          return
        }
      } catch (error) {
        if (
          !(error instanceof Up3SimulationError) ||
          ![
            'UP3_SIMULATION_CREATION_NOT_FOUND',
            'UP3_SIMULATION_CREATED_ORDER_REMOVED',
            'UP3_SIMULATION_UNAVAILABLE',
          ].includes(error.code)
        )
          throw error
        statusMessage = messages[error.code] ?? 'The creation result is unknown. Refresh using the same request UUID.'
      }
      const intent = this.session(req).creations[creationRequestId]
      this.render(res, 'creation-status', {
        creationRequestId,
        receipt,
        statusMessage,
        errors: intent?.validationErrors,
        canResume: Boolean(intent?.command),
      })
    })

  resumeCreation = async (req: Request, res: Response) =>
    this.guarded(res, async () => {
      const command = this.session(req).creations[String(req.params.creationRequestId)]?.command
      if (!command) throw new Up3SimulationError('UP3_SIMULATION_ID_CONFLICT', 409)
      await this.save(req)
      await this.createRequest(req, res, command)
    })
}
