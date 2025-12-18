import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AlcoholMonitoringService, AuditService } from '../../services'
import alcoholMonitoringViewModel from '../../models/view-models/alcoholMonitoring'
import { AlcoholMonitoringFormDataModel } from '../../models/form-data/alcoholMonitoring'
import TaskListService from '../../services/taskListService'
import FeatureFlags from '../../utils/featureFlags'

export default class AlcoholMonitoringController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringService: AlcoholMonitoringService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    // if notif org is court -> hide monitoring type question
    const isNotifyingOrgACourt = !(
      order.interestedParties?.notifyingOrganisation === 'PRISON' ||
      order.interestedParties?.notifyingOrganisation === 'PROBATION'
    )

    console.log(order)
    console.log(isNotifyingOrgACourt)

    const viewModel = alcoholMonitoringViewModel.construct(
      order.monitoringConditionsAlcohol ?? {
        monitoringType: null,
        startDate: null,
        endDate: null,
      },
      errors as never,
      formData as never,
      isNotifyingOrgACourt,
    )

    res.render(`pages/order/monitoring-conditions/alcohol-monitoring`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = req.order!
    const formData = AlcoholMonitoringFormDataModel.parse(req.body)

    // if notif org is court -> set formdata.monitoringType to 'ALCOHOL_ABSTINENCE'

    const isNotifyingOrgACourt = !(
      order.interestedParties?.notifyingOrganisation === 'PRISON' ||
      order.interestedParties?.notifyingOrganisation === 'PROBATION'
    )
    if (isNotifyingOrgACourt) {
      formData.monitoringType = 'ALCOHOL_ABSTINENCE'
    }

    const updateResult = await this.alcoholMonitoringService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      if (FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
        res.redirect(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', orderId),
        )
      } else {
        res.redirect(
          this.taskListService.getNextPage('ALCOHOL_MONITORING', {
            ...req.order!,
            monitoringConditionsAlcohol: updateResult,
          }),
        )
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
