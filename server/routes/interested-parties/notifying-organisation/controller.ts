import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import NotifyingOrganisationFormModel, { NotifyingOrganisationInput, NotifyingOrganisationValidator } from './formModel'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import { InterestedParties } from '../model'
import { filterNullValues } from '../../../utils/utils'

export default class NotifingOrganisationController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
  ) {
    super(store, service)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = req.flash('formData') as unknown as NotifyingOrganisationInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const cohort = res.locals.user.cohort?.cohort
    res.render(
      'pages/order/interested-parties/notifying-organisation',
      ViewModel.construct(formData[0], errors, order, cohort),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const cohort = res.locals.user.cohort?.cohort
    let formData = NotifyingOrganisationFormModel.parse(req.body)

    if (cohort === 'PROBATION' || cohort === 'HOME_OFFICE') {
      formData = {
        ...formData,
        notifyingOrganisation: cohort,
      }
    }

    const validationResult = NotifyingOrganisationValidator.safeParse(formData)

    if (!validationResult.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', order.id))
      return
    }

    const data: InterestedParties = filterNullValues({ ...order.interestedParties, ...validationResult.data })
    await this.service.update({
      data,
      accessToken: res.locals.user.token,
      orderId: order.id,
    })

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
