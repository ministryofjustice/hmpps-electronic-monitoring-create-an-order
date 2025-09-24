import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'

export default class CheckYourAnswersController {
  constructor(private readonly storeService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    // get monitoring conditions object from the store
    // use that object to generate the model
    // render view with model
    res.render('pages/order/monitoring-conditions/order-type-description/check-your-answers', {})
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    // get object from store
    // submit object to backend
    // redirect to summary page
  }
}
