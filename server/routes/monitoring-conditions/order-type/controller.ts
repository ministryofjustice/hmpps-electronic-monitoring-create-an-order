import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { OrderTypeFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import MonitoringConditionsBaseController from '../base/monitoringConditionBaseController'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'

export default class OrderTypeController extends MonitoringConditionsBaseController {
  constructor(
    readonly montoringConditionsStoreService: MonitoringConditionsStoreService,
    readonly monitoringConditionsService: MonitoringConditionsUpdateService,
  ) {
    super(montoringConditionsStoreService, monitoringConditionsService)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    const notifyingOrganisation = req.order?.interestedParties?.notifyingOrganisation
    if (!notifyingOrganisation) {
      // Throw error for now as this will not be possible in the future
      // Should figure out what behaviour we want if it isn't set
      throw new Error('notifyingOrganisation not set')
    }

    if (notifyingOrganisation === 'PRISON' || notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE') {
      this.montoringConditionsStoreService.updateOrderType(order, { orderType: 'POST_RELEASE' })
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', order.id))
      return
    }
    if (notifyingOrganisation === 'HOME_OFFICE') {
      await this.montoringConditionsStoreService.updateOrderType(order, { orderType: 'IMMIGRATION' })
      await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, req, res)
      return
    }

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(notifyingOrganisation, monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/order-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = OrderTypeFormDataModel.parse(req.body)

    if (formData.orderType === null || formData.orderType === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.orderTypeRequired,
          field: 'orderType',
          focusTarget: 'orderType',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE.replace(':orderId', order.id))
      return
    }
    await this.montoringConditionsStoreService.updateOrderType(order, formData)

    switch (formData.orderType) {
      case 'POST_RELEASE':
      case 'COMMUNITY':
      case 'BAIL':
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', order.id))
        return
      case 'IMMIGRATION':
      case 'CIVIL':
        await super.UpdateMonitoringConditionAndGoToMonitoringTypePage(order, req, res)
        return
      default:
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', order.id))
    }
  }
}
