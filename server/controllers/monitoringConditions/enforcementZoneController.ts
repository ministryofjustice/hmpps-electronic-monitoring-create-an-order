import { Request, RequestHandler, Response } from 'express'
import { AuditService, EnforcementZoneService } from '../../services'
import { getErrorsViewModel } from '../../utils/utils'
import paths from '../../constants/paths'
import { ErrorsViewModel } from '../../models/view-models/utils'
import TaskListService from '../../services/taskListService'
import EnforcementZoneFormDataModel from '../../models/form-data/enforcementZone'
import enforcementZoneViewModel from '../../models/view-models/enforcementZone'
import { ValidationResult } from '../../models/Validation'

export default class EnforcementZoneController {
  constructor(
    private readonly auditService: AuditService,
    private readonly zoneService: EnforcementZoneService,
    private readonly taskListService: TaskListService,
  ) {}

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, zoneId } = req.params
    const { action, ...formData } = EnforcementZoneFormDataModel.parse(req.body)
    const file = req.file as Express.Multer.File
    const zoneIdInt = Number.parseInt(zoneId, 10)

    const errors: ValidationResult = []
    let errorViewModel: ErrorsViewModel = {}
    // Update/Create zone details
    const result = await this.zoneService.updateZone({
      accessToken: res.locals.user.token,
      orderId,
      zoneId: zoneIdInt,
      ...formData,
    })
    if (result !== null) {
      errorViewModel = getErrorsViewModel(result)
      errors.push(...result)
    }

    // Upload file if exist
    if (file !== null && file !== undefined) {
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
    if (Object.keys(errorViewModel).length !== 0) {
      const viewModel = enforcementZoneViewModel.construct(parseInt(zoneId, 10), [], formData, errors)
      res.render(`pages/order/monitoring-conditions/enforcement-zone`, viewModel)
    } else {
      this.auditService.logAuditEvent({
        who: res.locals.user.username,
        correlationId: orderId,
        what: `Updated enforcement zone with zone id : ${zoneId}`,
      })
      if (formData.anotherZone === 'true')
        res.redirect(
          paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', orderId).replace(':zoneId', (zoneIdInt + 1).toString()),
        )
      else if (action === 'continue') {
        const order = req.order!
        if (order.enforcementZoneConditions.length - 1 > zoneIdInt)
          res.redirect(
            paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', orderId).replace(
              ':zoneId',
              (zoneIdInt + 1).toString(),
            ),
          )
        else {
          res.redirect(this.taskListService.getNextPage('ENFORCEMENT_ZONE_MONITORING', req.order!))
        }
      } else res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { zoneId } = req.params
    const order = req.order!
    const viewModel = enforcementZoneViewModel.construct(
      parseInt(zoneId, 10),
      order.enforcementZoneConditions,
      {} as never,
      [],
    )

    res.render(`pages/order/monitoring-conditions/enforcement-zone`, viewModel)
  }
}
