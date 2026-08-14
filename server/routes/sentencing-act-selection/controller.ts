import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import YesNoQuestionPageController from '../baseControllers/yes-no-question-page/controller'
import SentencingActService from './SentencingActService'
import { isValidationResult } from '../../models/Validation'
import { isNullOrUndefined } from '../../utils/utils'
import FeatureFlags from '../../utils/featureFlags'

export default class SentencingActSelection extends YesNoQuestionPageController {
  constructor(private readonly sentencingActService: SentencingActService) {
    super()
  }

  static isPageEnabled = (): boolean => FeatureFlags.getInstance().get('SENTENCING_ACT_ENABLED')

  view: RequestHandler = async (req: Request, res: Response) => {
    if (!SentencingActSelection.isPageEnabled()) {
      return res.redirect(paths.ORDER.SUMMARY.replace(':orderId', req.params.orderId as string))
    }
    // Hiding the back button on this page as a temp fix against disrupting order flow
    const hideBackAndCancel = true
    const current = req.order!.isSentencingAct
    let value
    if (isNullOrUndefined(value)) {
      value = undefined
    } else if (current) {
      value = 'yes'
    } else {
      value = 'no'
    }
    return super.getView(
      req,
      res,
      res.locals.content!.pages.setSentencingAct.questions.isSentencingAct.text,
      res.locals.content!.pages.setSentencingAct.title,
      value,
      hideBackAndCancel,
      hideBackAndCancel,
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string

    if (!SentencingActSelection.isPageEnabled()) {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
      return
    }

    const formData = super.tryGetValidFormData(
      req,
      res,
      paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION,
      paths.ORDER.SUMMARY,
      validationErrors.sentencingActSelection.required,
    )
    if (formData === undefined) return

    const result = await this.sentencingActService.setSentencingActFlag({
      accessToken: res.locals.user.token,
      orderId,
      isSentencingAct: formData.answer === 'yes',
    })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)
      res.redirect(paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION.replace(':orderId', orderId))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
