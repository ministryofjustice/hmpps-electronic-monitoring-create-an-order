import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskAtAddressFormModel from './formModel'
import RiskAtAddressViewModel from './viewModel'

export default class RiskAtAddressController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { riskCategory } = await this.riskAtInstallationStoreService.getRiskAtInstallation(req.order!)

    res.render('pages/order/installation-and-risk/risk-at-address', RiskAtAddressViewModel.construct(riskCategory))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { riskCategory } = RiskAtAddressFormModel.parse(req.body)

    await this.riskAtInstallationStoreService.updateField(order, 'riskCategory', riskCategory)

    res.redirect(paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id))
  }
}
