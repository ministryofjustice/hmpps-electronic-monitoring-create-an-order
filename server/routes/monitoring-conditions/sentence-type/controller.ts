import { Request, RequestHandler, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import constructModel from './viewModel'
import { ValidationResult } from '../../../models/Validation'
import { SentenceTypeFormDataModel } from './formModel'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'

export default class SentenceTypeController {
  constructor(private readonly montoringConditionsStoreService: MonitoringConditionsStoreService) {}

  view: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.order!.id
    let monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(orderId)

    if (!monitoringConditions.orderType) {
      const notifyingOrganisation = req.order?.interestedParties?.notifyingOrganisation
      if (notifyingOrganisation === 'PRISON' || notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE') {
        await this.montoringConditionsStoreService.updateOrderType(orderId, { orderType: 'POST_RELEASE' })
        monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(orderId)
      }
    }

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(monitoringConditions.orderType, monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/order-type-description/sentence-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.order!.id
    const formData = SentenceTypeFormDataModel.parse(req.body)

    if (formData.sentenceType === null || formData.sentenceType === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.monitoringConditions.sentenceTypeRequired,
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', orderId))
      return
    }

    if (formData.action === 'continue') {
      await this.montoringConditionsStoreService.updateSentenceType(orderId, {
        sentenceType: formData.sentenceType,
      })

      const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(orderId)

      if (monitoringConditions.orderType === 'POST_RELEASE') {
        switch (formData.sentenceType) {
          case 'STANDARD_DETERMINATE_SENTENCE':
            res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', orderId))
            return
          case 'DTO':
            // update to ISS page when it is made
            // res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISS.replace(':orderId', orderId))
            res.redirect(
              paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId),
            )

            return
          default:
            // update to PRARR page when it is made
            // res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', orderId))
            // return
            res.redirect(
              paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId),
            )
            return
        }
      }

      if (monitoringConditions.orderType === 'COMMUNITY') {
        switch (formData.sentenceType) {
          case 'COMMUNITY_YRO':
            // res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISS.replace(':orderId', orderId))
            res.redirect(
              paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId),
            )
            return
          default:
            res.redirect(
              paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId),
            )
            // res.redirect(
            //   paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_DATES.replace(':orderId', orderId),
            // )
            return
        }
      }

      if (monitoringConditions.orderType === 'BAIL') {
        // res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISS.replace(':orderId', orderId))
        // return
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId))
        return
      }

      res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', orderId))
    }
  }
}
