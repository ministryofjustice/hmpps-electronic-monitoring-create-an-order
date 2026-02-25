import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import ProbationDeliveryUnitFormModel, { ProbationDeliveryUnitInput, ProbationDeliveryUnitValidator } from './formModel'
import ViewModel from './viewModel'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import { ReferenceCatalogDDv5, ReferenceCatalogDDv6 } from '../../../types/i18n/reference'
import ProbationRegionDeliveryUnits from '../../../types/i18n/reference/probationRegionDeliveryUnits'

export default class ProbationDeliveryUnitController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
  ) {
    super(store, service)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)

    const formData = req.flash('formData') as unknown as ProbationDeliveryUnitInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const content = <ReferenceCatalogDDv5 | ReferenceCatalogDDv6>res.locals.content?.reference
    const region = <keyof ProbationRegionDeliveryUnits>storedData?.responsibleOrganisationRegion

    res.locals.unitList = region ? content?.probationRegionDeliveryUnits?.[region] : []

    res.render(
      'pages/order/interested-parties/probation-delivery-unit',
      ViewModel.construct(storedData, formData[0], errors),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = ProbationDeliveryUnitFormModel.parse(req.body)
    const validationResult = ProbationDeliveryUnitValidator.safeParse(formData)

    if (!validationResult.success) {
      req.flash('formData', formData)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'probationDeliveryUnit', validationResult.data.unit)

    await super.SubmitInterestedPartiesAndNext(
      order,
      req,
      res,
      paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
    )
  }
}
