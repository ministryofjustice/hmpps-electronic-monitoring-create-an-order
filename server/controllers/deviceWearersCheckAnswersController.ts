import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../services'

export default class DeviceWearerCheckAnswersController {
  constructor(private readonly auditService: AuditService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render(`pages/order/about-the-device-wearer/check-your-answers`)
  }
}
