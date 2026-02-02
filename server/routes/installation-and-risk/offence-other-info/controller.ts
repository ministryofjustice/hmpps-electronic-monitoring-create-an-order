import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import OffenceOtherInfoFormModel, { OffenceOtherInfoInput } from './formModel'
import viewModel from './viewModel'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import OffenceOtherInfoService from './service'

export default class OffenceOtherInfoController {
  constructor(private readonly service: OffenceOtherInfoService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.flash('formData') as unknown as OffenceOtherInfoInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/installation-and-risk/offence/offence-other-info',
      viewModel.construct(order, formData?.[0], errors || []),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = OffenceOtherInfoFormModel.parse(req.body)
    const result = await this.service.updateOffenceOtherInfo({
      accessToken: res.locals.user.token,
      orderId: order.id,
      formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
      return
    }
    if (formData.action === 'continue') {
      res.redirect(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id))
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
