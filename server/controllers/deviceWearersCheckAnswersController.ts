import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../services'
import deviceWearerCheckAnswersViewModel from '../models/view-models/deviceWearerCheckAnswers'

export default class DeviceWearerCheckAnswersController {
  constructor(private readonly auditService: AuditService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearer, deviceWearerResponsibleAdult } = req.order!

    const viewModel = deviceWearerCheckAnswersViewModel.construct(deviceWearer, deviceWearerResponsibleAdult, orderId)

    res.render(`pages/order/about-the-device-wearer/check-your-answers`, viewModel)
  }
}
