import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'

export default class RiskBehaviourController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { possibleRisk } = await this.riskAtInstallationStoreService.getRiskAtInstallation(order)
    const { reference } = getContent('en', order.dataDictionaryVersion)

    res.render('pages/WIP', {
      pageName: 'Risk behaviour',
      items: Object.entries(reference.possibleRisks).map(([value, text]) => ({
        value,
        text,
        checked: possibleRisk.includes(value),
      })),
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    await this.riskAtInstallationStoreService.updateField(
      order,
      'possibleRisk',
      req.body.branch ? [req.body.branch] : [],
    )

    res.redirect(paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', order.id))
  }
}
