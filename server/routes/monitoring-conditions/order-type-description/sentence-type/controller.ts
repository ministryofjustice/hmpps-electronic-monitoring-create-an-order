import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../../models/Validation'
import { SentenceTypeFormDataModel } from './formModel'
import paths from '../../../../constants/paths'
import { validationErrors } from '../../../../constants/validationErrors'

export default class SentenceTypeController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const order = req.order!
    let monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

    if (!monitoringConditions.orderType) {
      const notifyingOrganisation = req.order?.interestedParties?.notifyingOrganisation
      if (notifyingOrganisation === 'PRISON' || notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE') {
        await this.montoringConditionsStoreService.updateOrderType(order, { orderType: 'POST_RELEASE' })
        monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)
      }
    }

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(monitoringConditions.orderType, monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/sentence-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const order = req.order!
    const formData = SentenceTypeFormDataModel.parse(req.body)

    if (formData.sentenceType === null || formData.sentenceType === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.sentenceTypeRequired,
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', order.id))
      return
    }

    if (formData.action === 'continue') {
      await this.montoringConditionsStoreService.updateSentenceType(order, {
        sentenceType: formData.sentenceType,
      })

      const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(order)

      if (monitoringConditions.orderType === 'POST_RELEASE') {
        switch (formData.sentenceType) {
          case 'STANDARD_DETERMINATE_SENTENCE':
            res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', order.id))
            return
          case 'DTO':
            res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP.replace(':orderId', order.id))
            return
          default:
            res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', order.id))
            return
        }
      }

      if (monitoringConditions.orderType === 'COMMUNITY') {
        switch (formData.sentenceType) {
          case 'COMMUNITY_YRO':
            res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP.replace(':orderId', order.id))
            return
          default:
            res.redirect(
              paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_DATES.replace(':orderId', order.id),
            )

            return
        }
      }

      if (monitoringConditions.orderType === 'BAIL') {
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP.replace(':orderId', order.id))
        return
      }

      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_DATES.replace(':orderId', order.id))
    }
  }
}
