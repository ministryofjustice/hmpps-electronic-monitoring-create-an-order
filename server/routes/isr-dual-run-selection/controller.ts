import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import YesNoQuestionPageController from '../baseControllers/yes-no-question-page/controller'

export default class IsrDualRunSelection extends YesNoQuestionPageController {
  constructor() {
    super()
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    // new service get orders isIsr status
    return super.getView(
      req,
      res,
      res.locals.content!.pages.isrDualRunSelection.questions.isrEnabled.text,
      res.locals.content!.pages.isrDualRunSelection.title,
      undefined,
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string
    const formData = super.tryGetValidFormData(
      req,
      res,
      paths.INTEREST_PARTIES.ISR_DUAL_RUN_SELECTION,
      paths.ORDER.SUMMARY, // check this is the right fallback page
      validationErrors.isRejection.isRejectionRequired,
    )
    if (formData !== undefined) {
      if (formData.answer === 'yes') {
          // new service call to update order via id with isIsr flag
          return
      } else {
        return
      }
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
