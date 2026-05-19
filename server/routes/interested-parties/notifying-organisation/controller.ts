import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import NotifyingOrganisationFormModel, { NotifyingOrganisationInput, NotifyingOrganisationValidator } from './formModel'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import FeatureFlags from '../../../utils/featureFlags'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'
import OrderService from '../../../services/orderService'
import isVariationType from '../../../utils/isVariationType'

export default class NotifingOrganisationController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
    readonly orderService: OrderService,
  ) {
    super(store, service)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const formData = req.flash('formData') as unknown as NotifyingOrganisationInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const cohort = res.locals.user.cohort?.cohort
    res.locals.isInterestedPartiesFlowEnabled = FeatureFlags.getInstance().get('INTERESTED_PARTIES_FLOW_ENABLED')
    res.locals.content = getContent(Locales.en, 'DDV6')
    res.render(
      'pages/order/interested-parties/notifying-organisation',
      ViewModel.construct(formData[0], errors, cohort),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { order } = req
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
      res.redirect(paths.INTEREST_PARTIES.YOUR_DETAILS)
      return
    }

    // Update interested party if it variation
    if (order && isVariationType(order.type)) {
      await super.SubmitInterestedPartiesAndNext(order!, req, res)
      return
    }

    // Create new order
    const newOrder = await this.orderService.createOrderWithNotifyingOrganisation({
      accessToken: res.locals.user.token,
      data: {
        requestType: 'REQUEST',
        ...validationResult.data,
      },
    })

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', newOrder.id))
  }
}
