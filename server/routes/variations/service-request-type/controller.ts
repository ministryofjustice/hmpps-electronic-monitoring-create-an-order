import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ServiceRequestTypeFormDataModel } from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import ServiceRequestTypeService from '../serviceRequestTypeService'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'
import { SanitisedError } from '../../../sanitisedError'
import {
  getOrderChangeBlockedMessage,
  isAcceptedOrderForChange,
  ORDER_CHANGE_STATUS_CHANGED_MESSAGE,
} from '../../../utils/orderVersionEligibility'

export default class ServiceRequestTypeController {
  constructor(private readonly service: ServiceRequestTypeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    if (req.order && !isAcceptedOrderForChange(req.order)) {
      req.flash('submissionError', getOrderChangeBlockedMessage(req.order))
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', req.order.id))
      return
    }

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    if (res.locals.content === undefined) res.locals.content = getContent(Locales.en, 'DDV5')
    res.render('pages/order/variation/service-request-type', {
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { order } = req
    if (order && !isAcceptedOrderForChange(order)) {
      req.flash('submissionError', getOrderChangeBlockedMessage(order))
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    const formData = ServiceRequestTypeFormDataModel.parse(req.body)

    if (formData.serviceRequestType === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.serviceRequestType.serviceRequestTypeRequired,
          field: 'serviceRequestType',
          focusTarget: 'serviceRequestType',
        },
      ])
      if (order !== undefined) res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', order.id))
      else res.redirect(paths.VARIATION.CREATE_VARIATION)
      return
    }

    if (formData.serviceRequestType === 'NEEDS_CHECKING_OR_REFITTED') {
      res.redirect(paths.ORDER.NO_REFITS)
      return
    }

    if (formData.serviceRequestType === 'RESPONSIBLE_OFFICER_CHANGED') {
      res.redirect(paths.ORDER.NO_CHANGE_RESPONSIBLE_OFFICER)
      return
    }

    const input = {
      orderId: req.order?.id,
      accessToken: res.locals.user.token,
      type: formData.serviceRequestType!,
    }
    try {
      const result = await this.service.createNewVariation(input, req.order)
      res.redirect(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', result.id))
    } catch (error) {
      if ((error as SanitisedError).status !== 409) throw error
      if (!order) throw error
      req.flash('submissionError', ORDER_CHANGE_STATUS_CHANGED_MESSAGE)
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }
}
