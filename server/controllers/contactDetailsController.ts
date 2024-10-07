import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../services'

export default class ContactDetailsController {
  constructor(private readonly auditService: AuditService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { deviceWearerContactDetails } = req.order!

    res.render(`pages/order/contact-information/contact-details`, { contactDetails: deviceWearerContactDetails })
  }
}
