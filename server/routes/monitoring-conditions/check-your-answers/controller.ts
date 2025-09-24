import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { createModel } from './model'

export default class CheckYourAnswersController {
  constructor(private readonly storeService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    // get monitoring conditions object from the store
    const data = await this.storeService.getMonitoringConditions(orderId)
    // use that object to generate the model
    // render view with model
    //
    res.render(
      'pages/order/monitoring-conditions/order-type-description/check-your-answers',
      createModel(orderId, data, res.locals.content!),
    )
  }

  // update: RequestHandler = async (req: Request, res: Response) => {
  //   // get object from store
  //   // submit object to backend
  //   // redirect to summary page
  // }
}
