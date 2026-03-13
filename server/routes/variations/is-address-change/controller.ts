import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import YesNoQuestionPageController from '../../baseControllers/yes-no-question-page/controller'
import ServiceRequestTypeService from '../serviceRequestTypeService'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'

export default class IsAddressChangeController extends YesNoQuestionPageController {
  constructor(private readonly service: ServiceRequestTypeService) {
    super()
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    if (res.locals.content === undefined) res.locals.content = getContent(Locales.en, 'DDV5')
    return super.getView(
      req,
      res,
      res.locals.content!.pages.isAddressChange.questions.isAddressChange.text,
      res.locals.content!.pages.isAddressChange.title,
      undefined,
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const formData = super.tryGetValidFormData(
      req,
      res,
      paths.ORDER.IS_ADDRESS_CHANGE,
      paths.ORDER.SUMMARY,
      validationErrors.isAddressChange.isAddressChangeRequired,
    )
    if (formData !== undefined) {
      if (formData.answer === 'yes') {
        const input = {
          orderId: req.order?.id,
          accessToken: res.locals.user.token,
          type: 'REINSTALL_DEVICE',
        }
        const id = await this.service.createNewVariation(input, req.order)
        res.redirect(paths.ORDER.SUMMARY.replace(':orderId', id))
      } else {
        res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', orderId))
      }
    }
  }
}
