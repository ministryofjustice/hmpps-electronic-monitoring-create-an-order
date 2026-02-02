import { Request, RequestHandler, Response } from 'express'
import DetailsOfInstallationModel from './viewModel'

export default class DetailsOfInstallationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = DetailsOfInstallationModel.construct(order)

    res.render('pages/order/installation-and-risk/details-of-installation', model)
  }
}
