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
    const orderId = req.order!.id

    const data = await this.storeService.getMonitoringConditions(orderId)

    res.render(
      'pages/order/monitoring-conditions/order-type-description/check-your-answers',
      createModel(req.order!, data, res.locals.content!),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const data = await this.storeService.getMonitoringConditions(orderId)

    // Dummy data until we have pages that get this data
    data.startDate = new Date(2020, 10, 7, 10, 0).toISOString()
    data.endDate = new Date(2040, 10, 8, 10, 0).toISOString()
    data.curfew = true

    await this.monitoringConditionsService.updateMonitoringConditions({
      data,
      accessToken: res.locals.user.token,
      orderId,
    })

    // TODO
    // if continue
    // redirect to next page
    // if save as draft
    // go to summary
    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
