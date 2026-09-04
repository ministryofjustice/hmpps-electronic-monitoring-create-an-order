import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import { isValidationListResult, ValidationResult } from '../../../models/Validation'
import CurfewTimetableService from '../../../services/curfewTimetableService'
import { createStandardCurfewSchedule } from '../../../utils/standardCurfewTimes'
import { CurfewTimetableQuestionFormDataModel } from './formModel'
import constructModel from './viewModel'

export default class CurfewTimetableQuestionController {
  constructor(private readonly curfewTimetableService: CurfewTimetableService) {}

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
      return
    }

    if (formData.standardCurfewTimes === 'NO') {
      if (formData.action === 'continue') {
        res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id))
        return
      }

      res.redirect(res.locals.orderSummaryUri)
      return
    }

    const schedule = createStandardCurfewSchedule(order.curfewConditions?.curfewAddress)
    const updateResult = await this.curfewTimetableService.update({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: schedule,
    })

    if (isValidationListResult(updateResult)) {
      const validationResult = schedule.map((item, index) => ({
        ...item,
        errors: updateResult.filter(it => it.index === index).at(0)?.errors ?? [],
      }))
      req.flash('validationErrors', validationResult)
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id))
      return
    }

    if (formData.action !== 'continue') {
      res.redirect(res.locals.orderSummaryUri)
      return
    }

    res.redirect(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', order.id),
    )
  }
}
