import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ServiceRequestTypeFormDataModel } from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import ServiceRequestTypeService from './service'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'

export default class ServiceRequestTypeController {
  constructor(private readonly service: ServiceRequestTypeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    if (res.locals.content === undefined) res.locals.content = getContent(Locales.en, 'DDV5')
    res.render('pages/order/variation/service-request-type', {
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { order } = req
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

    if (order !== undefined) {
      await this.service.createVariationFromExisting({
        orderId: order.id,
        accessToken: res.locals.user.token,
        type: formData.serviceRequestType!,
      })
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    } else {
      const newOrder = await this.service.createVariation({
        accessToken: res.locals.user.token,
        type: formData.serviceRequestType!,
      })
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', newOrder.id))
    }
  }
}
