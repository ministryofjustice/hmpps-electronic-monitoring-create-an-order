import { createTextAnswer, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { lookup } from '../../../server/utils/utils'
import offences from '../../i18n/en/reference/offences'
import riskCategories from '../../i18n/en/reference/riskCategories'
import mappaLevel from '../../i18n/en/reference/mappaLevel'
import mappaCaseType from '../../i18n/en/reference/mappaCaseType'

const createViewModel = (order: Order, content: I18n, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk
  const answers = [
    createTextAnswer(questions.offence.text, lookup(offences, order.installationAndRisk?.offence), uri),
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      order.installationAndRisk?.riskCategory?.map(category => lookup(riskCategories, category)) ?? [],
      uri,
    ),
    createTextAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, uri),
    createTextAnswer(questions.mappaLevel.text, lookup(mappaLevel, order.installationAndRisk?.mappaLevel), uri),
    createTextAnswer(
      questions.mappaCaseType.text,
      lookup(mappaCaseType, order.installationAndRisk?.mappaCaseType),
      uri,
    ),
  ]
  return answers
}

export default createViewModel
