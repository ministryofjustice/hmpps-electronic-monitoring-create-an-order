import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import NationalSecurityDirectorateFormModel from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import viewModel from './viewModel'

export default class NationalSecurityDirectorateController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    res.render('pages/order/interested-parties/national-security-directorate', viewModel.construct(errors))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = NationalSecurityDirectorateFormModel.parse(req.body)
    if (formData.nsd === null || formData.nsd === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.nationalSecurityDirectorate.nationalSecurityDirectorateRequired,
          field: 'nsd',
          focusTarget: 'nsd',
        },
      ])
      res.redirect(paths.INTEREST_PARTIES.NSD.replace(':orderId', order.id))
    } else if (formData.nsd === 'YES') {
      req.flash('SpecialOrderSection', res.locals.content?.pages.nsd.section)
      res.redirect(paths.ORDER.SPECIAL_ORDER.replace(':orderId', order.id))
    } else {
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
    }
  }
}
