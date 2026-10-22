import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import ResponsibleOrganisationFormModel, {
  ResponsibleOrganisationInput,
  ResponsibleOrganisationValidator,
} from './formModel'
import ViewModel from './viewModel'
import { convertZodErrorToValidationError } from '../../../utils/validation/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'

export default class ResponsibleOrganisationController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
  ) {
    super(store, service)
  }

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

    const cohort = res.locals.user.cohort?.cohort
    let formData = ResponsibleOrganisationFormModel.parse(req.body)

    if (cohort === 'COURT') {
      formData = {
        ...formData,
        responsibleOrganisation: 'POLICE',
      }
    }

    const validationResult = ResponsibleOrganisationValidator(cohort).safeParse(formData)

    if (!validationResult.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_ORGANISATION.replace(':orderId', order.id))
      return
    }

    await this.store.updateResponsibleOrganisation(order, validationResult.data)
    await super.SubmitInterestedPartiesAndNext(order, req, res)
  }
}
