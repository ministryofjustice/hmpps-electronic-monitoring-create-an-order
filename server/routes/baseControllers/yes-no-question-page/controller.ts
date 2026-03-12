import { Request, Response } from 'express'
import { ValidationResult } from '../../../models/Validation'
import { YesNoQuestionFormData, YesNoQuestionFormDataModel } from './formModel'
import constructModel from './viewModel'

export default abstract class YesNoQuestionPageController {
  constructor(
    private pagePage: string,
    private cancelPath: string,
    private validationError: string,
  ) {}

  protected async getView(req: Request, res: Response, value?: string) {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    res.render('pages/order/edit/is-address-change', constructModel(value, errors))
  }

  protected tryGetValidFormData(req: Request, res: Response): YesNoQuestionFormData | undefined {
    const { orderId } = req.params
    const formData = YesNoQuestionFormDataModel.parse(req.body)
    if (formData.action === 'continue') {
      if (!formData.answer) {
        req.flash('validationErrors', [
          {
            error: this.validationError,
            field: 'answer',
            focusTarget: 'answer',
          },
        ])
        res.redirect(this.pagePage.replace(':orderId', orderId))
      } else {
        return formData
      }
    } else {
      res.redirect(this.cancelPath.replace(':orderId', orderId))
    }
    return undefined
  }
}
