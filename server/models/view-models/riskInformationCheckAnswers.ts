import Answer, {
  createTextAnswer,
  createMultipleChoiceAnswer,
  createTextAnswerWithoutActions,
} from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { lookup } from '../../utils/utils'

const createViewModel = (order: Order, content: I18n, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk
  const createTextAnswerMethod = order.status === 'SUBMITTED' ? createTextAnswerWithoutActions : createTextAnswer
  const answers = [
    createTextAnswerMethod(
      questions.offence.text,
      lookup(content.reference.offences, order.installationAndRisk?.offence),
      uri,
    ),
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      order.installationAndRisk?.riskCategory?.map(category => lookup(content.reference.riskCategories, category)) ??
        [],
      uri,
    ),
    createTextAnswerMethod(questions.riskDetails.text, order.installationAndRisk?.riskDetails, uri),
    createTextAnswerMethod(
      questions.mappaLevel.text,
      lookup(content.reference.mappaLevel, order.installationAndRisk?.mappaLevel),
      uri,
    ),
    createTextAnswerMethod(
      questions.mappaCaseType.text,
      lookup(content.reference.mappaCaseType, order.installationAndRisk?.mappaCaseType),
      uri,
    ),
  ]
  return answers
}

export default createViewModel
