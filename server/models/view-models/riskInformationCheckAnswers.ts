import { createTextAnswer, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'

const createViewModel = (order: Order, content: I18n, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk
  const answers = [
    createTextAnswer(questions.offence.text, order.installationAndRisk?.offence, uri),
    createMultipleChoiceAnswer(questions.riskCategory.text, order.installationAndRisk?.riskCategory ?? [], uri),
    createTextAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, uri),
    createTextAnswer(questions.mappaLevel.text, order.installationAndRisk?.mappaLevel, uri),
    createTextAnswer(questions.mappaCaseType.text, order.installationAndRisk?.mappaCaseType, uri),
  ]
  return answers
}

export default createViewModel
