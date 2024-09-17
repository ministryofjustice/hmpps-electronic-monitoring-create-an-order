import { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DeviceWearerService, OrderService } from '../services'

export default class DeviceWearerController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: DeviceWearerService,
    private readonly orderService: OrderService,
  ) {}

  edit: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const [order, deviceWearer] = await Promise.all([
      this.orderService.getOrder(orderId),
      this.deviceWearerService.getDeviceWearer(orderId),
    ])

    if (order.status === 'Submitted') {
      res.redirect(`/order/${orderId}/device-wearer`)
    } else {
      res.render(`pages/order/device-wearer/edit`, { deviceWearer })
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const [order, deviceWearer] = await Promise.all([
      this.orderService.getOrder(orderId),
      this.deviceWearerService.getDeviceWearer(orderId),
    ])

    if (order.status === 'Draft') {
      res.redirect(`/order/${orderId}/device-wearer/edit`)
    } else {
      res.render(`pages/order/device-wearer/view`, { deviceWearer })
    }
  }
}
