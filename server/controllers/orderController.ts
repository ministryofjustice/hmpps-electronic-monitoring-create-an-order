import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'
import TaskListService from '../services/taskListService'
import paths from '../constants/paths'
import { CreateOrderFormDataParser } from '../models/form-data/order'
import ConfirmationPageViewModel from '../models/view-models/confirmationPage'
import FeatureFlags from '../utils/featureFlags'
import isVariationType from '../utils/isVariationType'
import TimelineModel from '../models/view-models/timelineModel'
import { Order } from '../models/Order'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly taskListService: TaskListService,
  ) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    const formData = CreateOrderFormDataParser.parse(req.body)
    if (FeatureFlags.getInstance().get('SERVICE_REQUEST_TYPE_ENABLED') && formData.type === 'VARIATION') {
      res.redirect(paths.VARIATION.CREATE_VARIATION)
      return
    }

    const order = await this.orderService.createOrder({ accessToken: res.locals.user.token, data: formData })

    res.redirect(`/order/${order.id}/summary`)
  }

  createVariation: RequestHandler = async (req: Request, res: Response) => {
    const { action } = req.body
    const { orderId } = req.params
    const order = req.order!

    if (action === 'continue') {
      if (this.shouldShowRejectionPage(order)) {
        res.redirect(paths.ORDER.IS_REJECTION.replace(':orderId', orderId))
      } else {
        await this.orderService.createVariationFromExisting({
          orderId,
          accessToken: res.locals.user.token,
        })
        res.redirect(`/order/${orderId}/summary`)
      }
    }
  }

  private shouldShowRejectionPage = (order: Order): boolean => {
    const fmsResultDate = order.fmsResultDate ? new Date(order.fmsResultDate) : new Date(1900, 0, 0)
    const startDate = order.monitoringConditions.startDate
      ? new Date(order.monitoringConditions.startDate)
      : new Date(1900, 0, 0)
    const compareDate = fmsResultDate < startDate ? fmsResultDate : startDate
    compareDate.setDate(compareDate.getDate() + 30)
    return new Date() < compareDate
  }

  summary: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { versionId } = req.params
    const createNewOrderVersionEnabled = FeatureFlags.getInstance().get('CREATE_NEW_ORDER_VERSION_ENABLED')
    const error = req.flash('submissionError')

    const [sections, completedOrderVersions] = await Promise.all([
      this.taskListService.getSections(order, versionId),
      this.orderService.getCompleteVersions({
        orderId: order.id,
        accessToken: res.locals.user.token,
      }),
    ])

    const currentVersion = order.versionId
    let isMostRecentVersion: boolean = true
    if (versionId && completedOrderVersions.length > 0) {
      isMostRecentVersion = currentVersion === completedOrderVersions[0].versionId
    }

    res.render('pages/order/summary', {
      order: req.order,
      sections,
      error: error && error.length > 0 ? error[0] : undefined,
      createNewOrderVersionEnabled: createNewOrderVersionEnabled && isMostRecentVersion,
      timelineItems: TimelineModel.mapToTimelineItems(completedOrderVersions, order.id, currentVersion),
      isMostRecentVersion,
    })
  }

  confirmEdit: RequestHandler = async (req: Request, res: Response) => {
    const viewModel = ConfirmationPageViewModel.construct(req.order!)

    res.render('pages/order/edit-confirm', {
      ...viewModel,
    })
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render('pages/order/delete-confirm', {
      order,
    })
  }

  delete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action } = req.body

    if (action === 'continue') {
      const result = await this.orderService.deleteOrder({
        orderId: order.id,
        accessToken: res.locals.user.token,
      })

      if (result.ok) {
        res.redirect(paths.ORDER.DELETE_SUCCESS)
      } else {
        req.flash('deletionErrors', result.error)
        res.redirect(paths.ORDER.DELETE_FAILED)
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }

  deleteFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('deletionErrors')

    res.render('pages/order/delete-failed', { errors })
  }

  deleteSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-success')
  }

  submit: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const result = await this.orderService.submitOrder({
      orderId: order.id,
      accessToken: res.locals.user.token,
    })

    if (result.submitted) {
      res.redirect(paths.ORDER.SUBMIT_SUCCESS.replace(':orderId', order.id))
    } else if (result.type === 'alreadySubmitted' || result.type === 'incomplete') {
      req.flash('submissionError', result.error)
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    } else if (result.type === 'errorStatus') {
      res.redirect(paths.ORDER.SUBMIT_FAILED.replace(':orderId', order.id))
    } else if (result.type === 'partialSuccess') {
      res.redirect(paths.ORDER.SUBMIT_PARTIAL_SUCCESS.replace(':orderId', order.id))
    } else {
      req.flash('submissionError', 'Something unexpected happened. Please try again in a few minutes.')
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }

  submitFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')

    res.render('pages/order/submit-failed', { errors })
  }

  submitPartialSuccess: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    res.render('pages/order/submit-partial-success', { errors })
  }

  submitSuccess: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const orderType = req.order!.type

    res.render('pages/order/submit-success', {
      orderId,
      isVariation: isVariationType(orderType),
    })
  }
}
