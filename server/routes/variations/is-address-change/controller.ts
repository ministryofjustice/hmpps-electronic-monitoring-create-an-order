import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import YesNoQuestionPageController from '../../baseControllers/yes-no-question-page/controller'
import ServiceRequestTypeService from '../serviceRequestTypeService'

export default class IsAddressChangeController extends YesNoQuestionPageController {
  constructor(private readonly service: ServiceRequestTypeService) {
    super(paths.ORDER.IS_ADDRESS_CHANGE, paths.ORDER.SUMMARY, validationErrors.isAddressChange.isAddressChangeRequired)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    return super.getView(req, res, undefined)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const formData = super.tryGetValidFormData(req, res)
    if (formData !== undefined) {
      if (formData.answer === 'yes') {
        await this.service.createVariationFromExisting({
          orderId,
          accessToken: res.locals.user.token,
          type: 'REINSTALL_DEVICE',
        })
        res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
      } else {
        res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', orderId))
      }
    }
  }
}
