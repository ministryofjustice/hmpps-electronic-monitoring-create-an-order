import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import ProbationDeliveryUnitFormDataModel from '../../models/form-data/probationDeliveryUnit'
import probationDeliveryUnitViewModel from '../../models/view-models/probationDeliveryUnit'
import TaskListService from '../../services/taskListService'
import ProbationDeliveryUnitService from '../../services/probationDeliveryUnitService'
import { ReferenceCatalogDDv5 } from '../../types/i18n/reference'
import ProbationRegionDeliveryUnits from '../../types/i18n/reference/probationRegionDeliveryUnits'

export default class ProbationDeliveryUnitController {
  constructor(
    private readonly auditService: AuditService,
    private readonly probationDeliveryUnitService: ProbationDeliveryUnitService,
    private readonly taskListService: TaskListService,
  ) {}

  getDeliveryUnitsForProbationRegion = (
    content: ProbationRegionDeliveryUnits,
    region: keyof ProbationRegionDeliveryUnits,
  ): (string | { text: string; description: string })[] => {
    return content[region]
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { probationDeliveryUnit } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = probationDeliveryUnitViewModel.construct(
      probationDeliveryUnit,
      formData[0] as never,
      errors as never,
    )
    const content = <ReferenceCatalogDDv5>res.locals.content?.reference
    res.locals.unitList = this.getDeliveryUnitsForProbationRegion(
      content.probationRegionDeliveryUnits,
      'YORKSHIRE_AND_THE_HUMBER',
    )
    res.render('pages/order/contact-information/probation-delivery-unit', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = ProbationDeliveryUnitFormDataModel.parse(req.body)

    const result = await this.probationDeliveryUnitService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: { unit: formData.unit },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('INTERESTED_PARTIES', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
