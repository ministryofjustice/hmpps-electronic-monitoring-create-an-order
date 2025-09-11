import { Request, RequestHandler, Response } from 'express'
import { ValidationResult } from '../../models/Validation'
import { createGovukErrorSummary } from '../../utils/errors'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import { IsRejectionFromDataModel } from './models'

export default class IsRejectionController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render('pages/order/edit/is-rejection', {
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const formData = IsRejectionFromDataModel.parse(req.body)

    if (formData.isRejection === null) {
      req.flash('validationErrors', [
        {
          error: validationErrors.isRejection.isRejectionRequired,
          field: 'isRejection',
          focusTarget: 'isRejection',
        },
      ])

      res.redirect(paths.ORDER.IS_REJECTION.replace(':orderId', orderId))
    }
  }
}
