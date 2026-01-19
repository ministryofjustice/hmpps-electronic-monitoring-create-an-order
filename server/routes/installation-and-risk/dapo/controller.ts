import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import DapoService from './service'
import DapoFormModel, { DapoInput } from './formModel'
import { isValidationResult, ValidationResult } from '../../../models/Validation'

export default class DapoController {
  constructor(private readonly service: DapoService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.flash('formData') as unknown as DapoInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const { clauseId } = req.params

    res.render(
      'pages/order/installation-and-risk/offence/dapo',
      ViewModel.contruct(order, formData[0], errors, clauseId),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = DapoFormModel.parse(req.body)

    const result = await this.service.updateDapo({ formData, orderId: order.id, accessToken: res.locals.user.token })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.INSTALLATION_AND_RISK.DAPO.replace(':orderId', order.id))
      return
    }

    if (formData.action === 'continue') {
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
