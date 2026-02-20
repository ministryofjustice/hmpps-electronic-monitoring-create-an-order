import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import ResponsibleOrganisationFormModel, {
  ResponsibleOrganisationInput,
  ResponsibleOrganisationValidator,
} from './formModel'
import ViewModel from './viewModel'
import { convertZodErrorToValidationError } from '../../../utils/errors'

export default class ResponsibleOrganisationController {
  constructor(private readonly store: InterestedPartiesStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)

    const formData = req.flash('formData') as unknown as ResponsibleOrganisationInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/interested-parties/responsible-organisation',
      ViewModel.construct(storedData, formData[0], errors, order),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = ResponsibleOrganisationFormModel.parse(req.body)

    const validationResult = ResponsibleOrganisationValidator.safeParse(formData)

    if (!validationResult.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
      return
    }

    await this.store.updateResponsibleOrganisation(order, validationResult.data)

    if (formData.responsibleOrganisation === 'PROBATION') {
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
    } else {
      res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    }
  }
}
