import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ResponsibleOfficerFormModel, { ResponsibleOfficer, ResponsibleOfficerFormValidator } from './formModel'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import { ValidationResult } from '../../../models/Validation'
import ViewModel from './viewModel'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'

export default class ResponsibleOfficerController {
  constructor(readonly store: InterestedPartiesStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)
    const formData = req.flash('formData') as unknown as ResponsibleOfficer[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const viewModel = ViewModel.construct(storedData, formData[0], errors)
    res.render('pages/order/interested-parties/responsible-officer', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = ResponsibleOfficerFormModel.parse(req.body)

    const validationResult = ResponsibleOfficerFormValidator.safeParse(formData)
    if (!validationResult.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id))
      return
    }

    res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
  }
}
