import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../services'

export default class DeviceWearerContactDetailsController {
  constructor(private readonly auditService: AuditService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render(`pages/order/about-the-device-wearer/device-wearer-contact-details`)
  }
}
