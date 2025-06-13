import { Request, RequestHandler, Response } from 'express'
import installationAppointmenttViewModel from '../../models/view-models/installationAppointment'

export default class InstallationAppointmentController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const viewModel = installationAppointmenttViewModel.construct(req.order!.installationAppointment)
    res.render('pages/order/monitoring-conditions/installation-appointment', viewModel)
  }
}
