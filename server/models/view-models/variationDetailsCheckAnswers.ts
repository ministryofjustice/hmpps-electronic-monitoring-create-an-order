import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import { createAnswer, createDateAnswer } from '../../utils/checkYourAnswers'
import isVariationType from '../../utils/isVariationType'
import { Order } from '../Order'

const createViewModel = (order: Order, content: I18n | undefined) => {
  const answerOpts = { ignoreActions: true }
  const answers = [
    createDateAnswer(
      content?.pages.variationDetails.questions.variationDate.text || '',
      order.variationDetails?.variationDate,
      paths.VARIATION.VARIATION_DETAILS.replace(':orderId', order.id),
      answerOpts,
    ),
    createAnswer(
      content?.pages.variationDetails.questions.variationDetails.text || '',
      order.variationDetails?.variationDetails,
      paths.VARIATION.VARIATION_DETAILS.replace(':orderId', order.id),
      answerOpts,
    ),
  ]

  return { variationDetails: answers, isVariation: isVariationType(order.type) }
}

export default createViewModel
