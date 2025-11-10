import { Request, RequestHandler, Response } from 'express'
import { AuditService } from '../../../services'
import { getErrorsViewModel } from '../../../utils/utils'
import paths from '../../../constants/paths'
import { ErrorsViewModel } from '../../../models/view-models/utils'
import TaskListService from '../../../services/taskListService'
import { EnforcementZoneAddToListFormDataModel } from './formModel'
import enforcementZoneAddToListViewModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import Service from './service'

export default class EnforcementZoneController {
  constructor(
    private readonly auditService: AuditService,
    private readonly zoneService: Service,
    private readonly taskListService: TaskListService,
  ) {}

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, zoneId } = req.params
    const file = req.file as Express.Multer.File
    const zoneIdInt = Number.parseInt(zoneId, 10)
    req.body.zoneId = zoneIdInt
    const { action, ...formData } = EnforcementZoneAddToListFormDataModel.parse(req.body)
    const errors: ValidationResult = []
    let errorViewModel: ErrorsViewModel = {}
    // Update/Create zone details
    const result = await this.zoneService.updateZone({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })
    if (result !== null) {
      errorViewModel = getErrorsViewModel(result)
      errors.push(...result)
    }
    // Upload file if exist and only if the enforcement is updated
    else if (file !== null && file !== undefined) {
      const uploadResult = await this.zoneService.uploadZoneAttachment({
        accessToken: res.locals.user.token,
        orderId,
        zoneId: zoneIdInt,
        file,
      })
      if (uploadResult.userMessage != null) {
        errorViewModel.file = { text: uploadResult.userMessage }
        errors.push({
          field: 'file',
          error: uploadResult.userMessage,
        })
      }
    }

    if (Object.keys(errorViewModel).length !== 0 || errors.length > 0) {
      const viewModel = enforcementZoneAddToListViewModel.construct(parseInt(zoneId, 10), [], formData, errors)
      res.render(`pages/order/monitoring-conditions/enforcement-zone-add-to-list`, viewModel)
    } else {
      this.auditService.logAuditEvent({
        who: res.locals.user.username,
        correlationId: orderId,
        what: `Updated enforcement zone with zone id : ${zoneId}`,
      })
      if (action === 'continue') {
        const order = req.order!
        if (order.enforcementZoneConditions.length - 1 > zoneIdInt)
          res.redirect(
            // paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', orderId).replace(
            //   ':zoneId',
            //   (zoneIdInt + 1).toString(),
            // ),
            paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(
              ':orderId',
              req.order!.id,
            ),
          )
        else {
          res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
        }
      } else {
        res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
      }
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { zoneId } = req.params
    const order = req.order!
    const viewModel = enforcementZoneAddToListViewModel.construct(
      parseInt(zoneId, 10),
      order.enforcementZoneConditions,
      {} as never,
      [],
    )

    res.render(`pages/order/monitoring-conditions/enforcement-zone-add-to-list`, viewModel)
  }
}
