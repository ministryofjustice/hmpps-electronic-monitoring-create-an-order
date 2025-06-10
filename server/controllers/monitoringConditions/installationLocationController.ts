import { Request, RequestHandler, Response } from 'express'
import installationLocationViewModel from '../../models/view-models/installationLocation'

export default class InstallationLocationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const viewModel = installationLocationViewModel.construct()
    res.render('pages/order/monitoring-conditions/installation-location', viewModel)
  }
}
