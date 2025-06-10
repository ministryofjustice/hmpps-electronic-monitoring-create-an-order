import { Request, RequestHandler, Response } from 'express'

export default class InstallationLocationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/monitoring-conditions/installation-location')
  }
}
