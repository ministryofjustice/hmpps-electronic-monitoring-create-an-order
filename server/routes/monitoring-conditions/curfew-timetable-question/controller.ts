import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { CurfewTimetableQuestionFormDataModel } from './formModel'
import constructModel from './viewModel'

export default class CurfewTimetableQuestionController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(order, errors)

    res.render('pages/order/monitoring-conditions/curfew-timetable-question', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = CurfewTimetableQuestionFormDataModel.parse(req.body)

    if (!formData.standardCurfewTimes) {
      req.flash('validationErrors', [
        {
          error: validationErrors.curfewTimetableQuestion.standardCurfewTimesRequired,
          field: 'standardCurfewTimes',
          focusTarget: 'standardCurfewTimes',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE_QUESTION.replace(':orderId', order.id))
    }
  }
}
