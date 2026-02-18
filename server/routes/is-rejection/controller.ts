import { Request, RequestHandler, Response } from 'express'
import { ValidationResult } from '../../models/Validation'
import { createGovukErrorSummary } from '../../utils/errors'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import { IsRejectionFromDataModel } from './models'
import IsRejectionService from './service'
import FeatureFlags from '../../utils/featureFlags'

export default class IsRejectionController {
  constructor(private readonly service: IsRejectionService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render('pages/order/edit/is-rejection', {
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = IsRejectionFromDataModel.parse(req.body)

    if (formData.action === 'continue') {
      if (formData.isRejection === null) {
        req.flash('validationErrors', [
          {
            error: validationErrors.isRejection.isRejectionRequired,
            field: 'isRejection',
            focusTarget: 'isRejection',
          },
        ])
        res.redirect(paths.ORDER.IS_REJECTION.replace(':orderId', orderId))
      } else {
        if (formData.isRejection) {
          await this.service.createAmendOriginalFromExisting({
            orderId,
            accessToken: res.locals.user.token,
          })
        } else {
          if (FeatureFlags.getInstance().get('SERVICE_REQUEST_TYPE_ENABLED')) {
            res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', orderId))
            return
          }

          await this.service.createVariationFromExisting({
            orderId,
            accessToken: res.locals.user.token,
          })
        }

        res.redirect(`/order/${orderId}/summary`)
      }
    } else {
      res.redirect(`/order/${orderId}/summary`)
    }
  }
}
