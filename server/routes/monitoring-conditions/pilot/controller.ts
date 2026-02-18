import { Request, Response, RequestHandler } from 'express'
import constructModel from './viewModel'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import { PilotFormDataModel } from './formModel'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'

export default class PilotController {
  constructor(private readonly store: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const data = await this.store.getMonitoringConditions(order)

    const model = constructModel(order, data, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/pilot', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = PilotFormDataModel.parse(req.body)

    if (formData.pilot === null || formData.pilot === undefined) {
      req.flash('validationErrors', [{ error: validationErrors.monitoringConditions.pilotRequired, field: 'pilot' }])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', order.id))
      return
    }

    await this.store.updateField(order, 'pilot', formData.pilot)

    const isAcquisitiveCrime =
      formData.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE' ||
      formData.pilot === 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW'

    const isDapol =
      formData.pilot === 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL' ||
      formData.pilot === 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC'

    const isProbation = order.interestedParties?.notifyingOrganisation === 'PROBATION'

    const isDDv6OrNewer = isOrderDataDictionarySameOrAbove('DDV6', order)

    if (isAcquisitiveCrime) {
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE.replace(':orderId', order.id))
      return
    }

    if (isDapol && isProbation && isDDv6OrNewer) {
      res.redirect(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.DAPOL_MISSED_IN_ERROR.replace(':orderId', order.id),
      )
      return
    }

    res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
  }
}
