import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import isVariationType from '../../../utils/isVariationType'
import { notifyingOrganisationCourts } from '../../../models/NotifyingOrganisation'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import NotifyingOrganisationFormModel, { NotifyingOrganisationInput, NotifyingOrganisationValidator } from './formModel'
import ViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import { InterestedParties } from '../model'

export default class NotifingOrganisationController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
  ) {
    super(store, service)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)

    const formData = req.flash('formData') as unknown as NotifyingOrganisationInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const cohort = res.locals.user.cohort?.cohort

    res.render(
      'pages/order/interested-parties/notifying-organisation',
      ViewModel.construct(storedData, formData[0], errors, order, cohort),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const cohort = res.locals.user.cohort?.cohort

    let formData = NotifyingOrganisationFormModel.parse(req.body)

    let responsibleOfficerData:
      | Pick<InterestedParties, 'responsibleOfficerFirstName' | 'responsibleOfficerLastName'>
      | undefined

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

    if (validationResult.data.notifyingOrganisation === 'HOME_OFFICE') {
      responsibleOfficerData = {
        responsibleOfficerFirstName: 'Home',
        responsibleOfficerLastName: 'Office',
      }
    }

    await this.store.updateNotifyingOrganisation(order, validationResult.data, responsibleOfficerData)

    if (isVariationType(order.type)) {
      const startDate = order.monitoringConditions.startDate
        ? new Date(order.monitoringConditions.startDate)
        : new Date(1900, 0, 0)

      if (startDate < new Date()) {
        await super.SubmitInterestedPartiesAndNext(order, req, res)
        return
      }
    }

    if (
      (notifyingOrganisationCourts as readonly string[]).indexOf(validationResult.data.notifyingOrganisation!) > -1 ||
      validationResult.data.notifyingOrganisation === 'HOME_OFFICE'
    ) {
      res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
      return
    }
    res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id))
  }
}
