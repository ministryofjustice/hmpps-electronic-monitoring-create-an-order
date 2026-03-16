import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import IsRejectionService from './service'
import FeatureFlags from '../../utils/featureFlags'
import YesNoQuestionPageController from '../baseControllers/yes-no-question-page/controller'
import { Order } from '../../models/Order'

export default class IsRejectionController extends YesNoQuestionPageController {
  constructor(private readonly service: IsRejectionService) {
    super()
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    return super.getView(
      req,
      res,
      res.locals.content!.pages.isRejection.questions.isRejection.text,
      res.locals.content!.pages.isRejection.title,
      undefined,
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = super.tryGetValidFormData(
      req,
      res,
      paths.ORDER.IS_REJECTION,
      paths.ORDER.SUMMARY,
      validationErrors.isRejection.isRejectionRequired,
    )
    if (formData !== undefined) {
      if (formData.answer === 'yes') {
        await this.service.createAmendOriginalFromExisting({
          orderId,
          accessToken: res.locals.user.token,
        })
      } else {
        if (
          FeatureFlags.getInstance().get('SERVICE_REQUEST_TYPE_ENABLED') &&
          this.shouldShowIsAddressChangePage(req.order!)
        ) {
          res.redirect(paths.ORDER.IS_ADDRESS_CHANGE.replace(':orderId', orderId))
          return
        }

        await this.service.createVariationFromExisting({
          orderId,
          accessToken: res.locals.user.token,
        })
      }
      res.redirect(`/order/${orderId}/summary`)
    }
  }

  private shouldShowIsAddressChangePage = (order: Order): boolean => {
    const startDate = order.monitoringConditions.startDate
      ? new Date(order.monitoringConditions.startDate)
      : new Date(1900, 0, 0)
    const today = new Date()

    return startDate <= today
  }
}
