import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import YesNoQuestionPageController from '../../baseControllers/yes-no-question-page/controller'
import ServiceRequestTypeService from '../serviceRequestTypeService'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'
import { SanitisedError } from '../../../sanitisedError'
import {
  getOrderChangeBlockedMessage,
  isAcceptedOrderForChange,
  ORDER_CHANGE_STATUS_CHANGED_MESSAGE,
} from '../../../utils/orderVersionEligibility'

export default class IsAddressChangeController extends YesNoQuestionPageController {
  constructor(private readonly service: ServiceRequestTypeService) {
    super()
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    if (req.order && !isAcceptedOrderForChange(req.order)) {
      req.flash('submissionError', getOrderChangeBlockedMessage(req.order))
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', req.order.id))
      return
    }

    if (res.locals.content === undefined) res.locals.content = getContent(Locales.en, 'DDV5')
    super.getView(
      req,
      res,
      res.locals.content!.pages.isAddressChange.questions.isAddressChange.text,
      res.locals.content!.pages.isAddressChange.title,
      undefined,
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    if (req.order && !isAcceptedOrderForChange(req.order)) {
      req.flash('submissionError', getOrderChangeBlockedMessage(req.order))
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', req.order.id))
      return
    }

    const orderId = req.params.orderId as string

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
        try {
          const order = await this.service.createNewVariation(input, req.order)
          res.redirect(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', order.id))
        } catch (error) {
          if ((error as SanitisedError).status !== 409) throw error
          if (!req.order) throw error
          req.flash('submissionError', ORDER_CHANGE_STATUS_CHANGED_MESSAGE)
          res.redirect(paths.ORDER.SUMMARY.replace(':orderId', req.order.id))
        }
      } else {
        res.redirect(paths.VARIATION.SERVICE_REQUEST_TYPE.replace(':orderId', orderId))
      }
    }
  }
}
