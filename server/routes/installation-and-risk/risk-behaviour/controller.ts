import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskBehaviourFormModel from './formModel'
import RiskBehaviourViewModel from './viewModel'

export default class RiskBehaviourController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { possibleRisk } = await this.riskAtInstallationStoreService.getRiskAtInstallation(req.order!)

    res.render('pages/order/installation-and-risk/risk-behaviour', RiskBehaviourViewModel.construct(possibleRisk))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { possibleRisk } = RiskBehaviourFormModel.parse(req.body)

    await this.riskAtInstallationStoreService.updateField(order, 'possibleRisk', possibleRisk)

    res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
  }
}
