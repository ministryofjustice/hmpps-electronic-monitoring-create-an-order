import { Request, RequestHandler, Response } from 'express'
import { AuditService, DeviceWearerService } from '../services'

export default class DeviceWearerController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerService: DeviceWearerService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { deviceWearer } = req.order!

    res.render(`pages/order/device-wearer/view`, { deviceWearer })
  }
}
