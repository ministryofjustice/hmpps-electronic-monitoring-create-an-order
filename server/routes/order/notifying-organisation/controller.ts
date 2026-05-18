import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesStoreService from '../../interested-parties/interestedPartiesStoreService'
import NotifyingOrganisationFormModel, {
  NotifyingOrganisationInput,
  NotifyingOrganisationValidator,
} from '../../interested-parties/notifying-organisation/formModel'
import ViewModel from '../../interested-parties/notifying-organisation/viewModel'

export default class OrderNotifyingOrganisationController {
  constructor(private readonly store: InterestedPartiesStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)
    const formData = req.flash('formData') as unknown as NotifyingOrganisationInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const cohort = res.locals.user.cohort?.cohort

    res.render('pages/order/interested-parties/notifying-organisation', {
      ...ViewModel.construct(storedData, formData[0], errors, order, cohort),
      isOrderNotifyingOrganisationPage: true,
    })
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
      res.redirect(paths.ORDER.NOTIFYING_ORGANISATION.replace(':orderId', order.id))
      return
    }

    await this.store.updateNotifyingOrganisation(order, validationResult.data)

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
