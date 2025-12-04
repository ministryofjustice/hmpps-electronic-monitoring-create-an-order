import { RequestHandler } from 'express'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import VariationService from '../../services/variationService'
import { VariationDetailsFormDataParser } from '../../models/form-data/variationDetails'
import { isValidationResult } from '../../models/Validation'
import createViewModel from '../../models/view-models/variationDetails'
import paths from '../../constants/paths'
import OrderChecklistService from '../../services/orderChecklistService'

export default class VariationDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly variationDetailsService: VariationService,
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
  ) {}

  view: RequestHandler = async (req, res) => {
    const order = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render(
      'pages/order/variation/variation-details',
      createViewModel(order, formData.length > 0 ? (formData[0] as never) : ({} as never), errors as never),
    )
  }

  update: RequestHandler = async (req, res) => {
    const { orderId } = req.params
    const order = req.order!
    const { action, ...formData } = VariationDetailsFormDataParser.parse(req.body)
    formData.orderType = order.type
    const result = await this.variationDetailsService.updateVariationDetails({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.VARIATION.VARIATION_DETAILS.replace(':orderId', orderId))
    } else if (action === 'continue') {
      this.checklistService.updateChecklist(
        `${order.id}-${order.versionId}`,
        'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
      )
      res.redirect(this.taskListService.getNextPage('VARIATION_DETAILS', req.order!))
    } else {
      this.checklistService.updateChecklist(
        `${order.id}-${order.versionId}`,
        'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
      )
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
