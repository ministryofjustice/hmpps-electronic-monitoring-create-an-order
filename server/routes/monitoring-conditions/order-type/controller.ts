import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { OrderTypeFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import { ValidationResult } from '../../../models/Validation'

export default class OrderTypeController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions('some token')

    const notifyingOrganisation = req.order?.interestedParties?.notifyingOrganisation
    if (!notifyingOrganisation) {
      // Throw error for now as this will not be possible in the future
      // Should figure out what behaviour we want if it isn't set
      throw new Error('notifyingOrganisation not set')
    }

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(notifyingOrganisation, monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/order-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const formData = OrderTypeFormDataModel.parse(req.body)

    if (formData.orderType === null || formData.orderType === undefined) {
      req.flash('validationErrors', [
        {
          error: 'Select the order type',
          field: 'orderType',
          focusTarget: 'orderType',
        },
      ])
      res.redirect(`${paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION}/order-type`.replace(':orderId', orderId))
      return
    }

    if (formData.action === 'continue') {
      this.montoringConditionsStoreService.updateOrderType(orderId, formData)

      // continue to next page
      res.redirect(`/order/${orderId}/summary`)
    }
  }
}
