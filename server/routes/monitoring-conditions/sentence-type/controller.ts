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
    const monitoringConditions = await this.montoringConditionsStoreService.getMonitoringConditions(orderId)

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const model = constructModel(monitoringConditions, errors)

    res.render('pages/order/monitoring-conditions/sentence-type/sentence-type', model)
  }

  update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.order!.id

    const formData = SentenceTypeFormDataModel.safeParse(req.body)

    if (!formData.success || formData.data.sentenceType === null || formData.data.sentenceType === undefined) {
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

    if (formData.data.action === 'continue') {
      await this.montoringConditionsStoreService.updateSentenceType(orderId, formData.data)

      switch (formData.data.sentenceType) {
        case 'Standard Determinate Sentence':
          res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', orderId))
          return
        case 'Detention and Training Order (DTO)':
          res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISS.replace(':orderId', orderId))
          return
        case 'Section 250 / Section 91':
        default:
          res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', orderId))
      }
    }
  }
}
