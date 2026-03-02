import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import { ProbationDeliveryUnitInput, ProbationDeliveryUnitValidator } from './formModel'
import ViewModel from './viewModel'
import { convertZodErrorToValidationError } from '../../../utils/errors'
import InterestedPartiesBaseController from '../base/interestedPartiesBaseController'
import UpdateInterestedPartiesService from '../interestedPartiesService'
import { ReferenceCatalogDDv5, ReferenceCatalogDDv6 } from '../../../types/i18n/reference'
import ProbationRegionDeliveryUnits from '../../../types/i18n/reference/probationRegionDeliveryUnits'
import { ProbationDeliveryUnitService } from '../../../services'

export default class ProbationDeliveryUnitController extends InterestedPartiesBaseController {
  constructor(
    readonly store: InterestedPartiesStoreService,
    readonly service: UpdateInterestedPartiesService,
    private readonly pduService: ProbationDeliveryUnitService,
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

    const validationResult = ProbationDeliveryUnitValidator.safeParse(req.body)

    if (!validationResult.success) {
      req.flash('formData', req.body)
      req.flash('validationErrors', convertZodErrorToValidationError(validationResult.error))
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'probationDeliveryUnit', validationResult.data.unit)

    const result = await this.pduService.update({
      orderId: order.id,
      accessToken: res.locals.user.token,
      data: { unit: validationResult.data.unit },
    })

    if (isValidationResult(result)) {
      req.flash('formData', req.body)
      req.flash('validationErrors', result)
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
      return
    }

    res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
  }
}
