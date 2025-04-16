import { createTextAnswer, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'

const createViewModel = (order: Order, content: I18n) => {
  const { questions } = content.pages.installationAndRisk
  const answers = [
    createTextAnswer(questions.offence.text, order.installationAndRisk?.offence, ''),
    createMultipleChoiceAnswer(questions.riskCategory.text, order.installationAndRisk?.riskCategory ?? [], ''),
    createTextAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, ''),
    createTextAnswer(questions.mappaLevel.text, order.installationAndRisk?.mappaLevel, ''),
    createTextAnswer(questions.mappaCaseType.text, order.installationAndRisk?.mappaCaseType, ''),
  ]
  return answers
}

export default createViewModel
