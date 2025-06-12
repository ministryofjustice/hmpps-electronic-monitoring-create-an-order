import { Request, RequestHandler, Response } from 'express'

export default class InstallationAppointmentController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/monitoring-conditions/installation-appointment')
  }
}
