import { Request, RequestHandler, Response } from 'express'

export default class DetailsOfInstallationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/installation-and-risk/details-of-installation', {})
  }
}
