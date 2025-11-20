import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { PoliceAreaFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'

export default class PoliceAreaController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = await this.store.getMonitoringConditions(order)

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const model = constructModel(data, errors, res.locals.content!)
    res.render('pages/order/monitoring-conditions/order-type-description/police-area', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = PoliceAreaFormDataModel.parse(req.body)

    if (formData.policeArea === undefined || formData.policeArea === null) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.policeAreaRequired,
          field: 'policeArea',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA.replace(':orderId', order.id))
      return
    }

    if (formData.policeArea === "The device wearer's release address is in a different police force area") {
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HARD_STOP.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'policeArea', formData.policeArea)

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
  }
}
