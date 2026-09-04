import { Request, RequestHandler, Response } from 'express'
import { ValidationResult } from '../../../models/Validation'
import constructModel from './viewModel'

export default class CurfewTimetableQuestionController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(order, errors)

    res.render('pages/order/monitoring-conditions/curfew-timetable-question', model)
  }
}
