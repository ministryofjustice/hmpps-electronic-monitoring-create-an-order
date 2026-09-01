import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { CurfewDayOfReleaseFormDataModel } from './formModel'
import constructModel from './viewModel'

export default class CurfewDayOfReleaseController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(req.order!, errors)

    res.render('pages/order/monitoring-conditions/curfew-day-of-release', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = CurfewDayOfReleaseFormDataModel.parse(req.body)

    if (!formData.standardCurfewTimes) {
      req.flash('validationErrors', [
        {
          error: validationErrors.curfewDayOfRelease.standardCurfewTimesRequired,
          field: 'standardCurfewTimes',
          focusTarget: 'standardCurfewTimes',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE.replace(':orderId', order.id))
      return
    }

    res.redirect(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id))
  }
}
