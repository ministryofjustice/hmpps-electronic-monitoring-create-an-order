import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'

export default class RiskAtAddressController {
  constructor(private readonly riskAtInstallationStoreService: RiskAtInstallationStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { riskCategory } = await this.riskAtInstallationStoreService.getRiskAtInstallation(order)
    const { reference } = getContent('en', order.dataDictionaryVersion)

    res.render('pages/WIP', {
      pageName: 'Risk at address',
      items: Object.entries(reference.riskCategories).map(([value, text]) => ({
        value,
        text,
        checked: riskCategory.includes(value),
      })),
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    await this.riskAtInstallationStoreService.updateField(
      order,
      'riskCategory',
      req.body.branch ? [req.body.branch] : [],
    )

    res.redirect(paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', order.id))
  }
}
