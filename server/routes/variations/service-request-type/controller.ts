import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { ServiceRequestTypeFormDataModel } from './formModel'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import ServiceRequestTypeService from './service'

export default class ServiceRequestTypeController {
  constructor(private readonly service: ServiceRequestTypeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render('pages/order/variation/service-request-type', {
      errorSummary: createGovukErrorSummary(errors),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = ServiceRequestTypeFormDataModel.parse(req.body)

    if (formData.serviceRequestType === undefined) {
      req.flash('validationErrors', [
        {
          error: validationErrors.serviceRequestType.serviceRequestTypeRequired,
          field: 'serviceRequestType',
          focusTarget: 'serviceRequestType',
        },
      ])
      res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', order.id))
      return
    }

    await this.service.createVariationFromExisting({
      orderId: order.id,
      accessToken: res.locals.user.token,
      serviceRequestType: formData.serviceRequestType!,
    })
    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
