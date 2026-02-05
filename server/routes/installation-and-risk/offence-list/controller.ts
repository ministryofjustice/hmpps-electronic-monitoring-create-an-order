import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import constructModel from './viewModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import orderTypeDescriptions from '../../../i18n/en/reference/orderTypeDescriptions'

export default class OffenceListController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/offence/offence-list',
      constructModel(order, res.locals.content!, errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.body
    const isFamilyCourt = order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT'

    if (formData.addAnother === null || formData.addAnother === undefined) {
      const validationError = isFamilyCourt
        ? validationErrors.dapoClauseSummaryList
        : validationErrors.offenceSummaryList
      req.flash('validationErrors', [
        {
          error: validationError.addAnotherRequired,
          field: 'addAnother',
          focusTarget: 'addAnother',
        },
      ])
      return res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
    }
    const nextPagePath: string = paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION

    return res.redirect(nextPagePath.replace(':orderId', order.id))
  }
}
