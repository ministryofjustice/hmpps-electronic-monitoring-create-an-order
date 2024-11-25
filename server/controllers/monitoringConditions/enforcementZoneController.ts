import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import { AuditService, EnforcementZoneService } from '../../services'
import { deserialiseDate, getErrorsViewModel } from '../../utils/utils'
import paths from '../../constants/paths'
import { ErrorsViewModel } from '../../models/view-models/utils'
import TaskListService from '../../services/taskListService'

const ZoneFormDataModel = z.object({
  action: z.string(),
  description: z.string().default(''),
  duration: z.string().default(''),
  endDay: z.string().default(''),
  endMonth: z.string().default(''),
  endYear: z.string().default(''),
  startDay: z.string().default(''),
  startMonth: z.string().default(''),
  startYear: z.string().default(''),
  zoneType: z.string().nullable().default(null),
  anotherZone: z.string().default(''),
})

export default class EnforcementZoneController {
  constructor(
    private readonly auditService: AuditService,
    private readonly zoneService: EnforcementZoneService,
    private readonly taskListService: TaskListService,
  ) {}

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, zoneId } = req.params
    const { action, ...formData } = ZoneFormDataModel.parse(req.body)
    const file = req.file as Express.Multer.File
    const zoneIdInt = Number.parseInt(zoneId, 10)

    let errorViewModel: ErrorsViewModel = {}
    // Update/Create zone details
    const result = await this.zoneService.updateZone({
      accessToken: res.locals.user.token,
      orderId,
      zoneId: zoneIdInt,
      ...formData,
    })
    if (result !== null) errorViewModel = getErrorsViewModel(result)

    // Upload file if exist
    if (file !== null && file !== undefined) {
      const uploadResult = await this.zoneService.uploadZoneAttachment({
        accessToken: res.locals.user.token,
        orderId,
        zoneId: zoneIdInt,
        file,
      })
      if (uploadResult.userMessage != null) errorViewModel.file = { text: uploadResult.userMessage }
    }
    if (Object.keys(errorViewModel).length !== 0)
      res.render(`pages/order/monitoring-conditions/enforcement-zone`, { zone: formData, error: errorViewModel })
    else {
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

    const enforcementZone = order.enforcementZoneConditions.find(zone => zone.zoneId === Number.parseInt(zoneId, 10))
    const [startYear, startMonth, startDay] = deserialiseDate(enforcementZone?.startDate || '')
    const [endYear, endMonth, endDay] = deserialiseDate(enforcementZone?.endDate || '')

    res.render(`pages/order/monitoring-conditions/enforcement-zone`, {
      zone: {
        startYear,
        startMonth,
        startDay,
        endYear,
        endMonth,
        endDay,
        ...enforcementZone,
      },
    })
  }
}
