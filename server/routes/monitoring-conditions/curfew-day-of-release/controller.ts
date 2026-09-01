import { Request, RequestHandler, Response } from 'express'
import { ValidationResult } from '../../../models/Validation'
import constructModel from './viewModel'

export default class CurfewDayOfReleaseController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(req.order!, errors)

    res.render('pages/order/monitoring-conditions/curfew-day-of-release', model)
  }
}
