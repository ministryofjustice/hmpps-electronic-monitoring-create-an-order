import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { createModel } from './model'
import paths from '../../../constants/paths'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'

export default class CheckYourAnswersController {
  constructor(
    private readonly storeService: MonitoringConditionsStoreService,
    private readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = await this.storeService.getMonitoringConditions(order)

    res.render(
      'pages/order/monitoring-conditions/order-type-description/check-your-answers',
      createModel(req.order!, data, res.locals.content!),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const data = await this.storeService.getMonitoringConditions(order)

    await this.monitoringConditionsService.updateMonitoringConditions({
      data,
      accessToken: res.locals.user.token,
      orderId: order.id,
    })

    // TODO
    // if continue
    // redirect to next page
    // if save as draft
    // go to summary
    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
