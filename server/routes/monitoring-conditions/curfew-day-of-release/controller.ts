import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import CurfewReleaseDateService from '../../../services/curfewReleaseDateService'
import { CurfewDayOfReleaseFormDataModel } from './formModel'
import { STANDARD_CURFEW_TIMES } from './standardCurfewTimes'
import constructModel from './viewModel'

export default class CurfewDayOfReleaseController {
  constructor(private readonly curfewReleaseDateService: CurfewReleaseDateService) {}

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

    if (formData.standardCurfewTimes === 'YES') {
      const updateResult = await this.curfewReleaseDateService.update({
        accessToken: res.locals.user.token,
        order,
        data: {
          curfewAddress: order.curfewReleaseDateConditions?.curfewAddress,
          startTime: STANDARD_CURFEW_TIMES.startTime,
          endTime: STANDARD_CURFEW_TIMES.endTime,
        },
      })

      if (isValidationResult(updateResult)) {
        req.flash('validationErrors', updateResult)
        res.redirect(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE.replace(':orderId', order.id))
        return
      }

      if (formData.action === 'continue') {
        res.redirect(paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS.replace(':orderId', order.id))
        return
      }

      res.redirect(res.locals.orderSummaryUri)
      return
    }

    if (formData.action !== 'continue') {
      res.redirect(res.locals.orderSummaryUri)
      return
    }

    res.redirect(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id))
  }
}
