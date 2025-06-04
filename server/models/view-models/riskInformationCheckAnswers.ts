import { createAnswer, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { formatDateTime, lookup } from '../../utils/utils'
import config from '../../config'

const createViewModel = (order: Order, content: I18n, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR' }
  const answers = [
    createAnswer(
      questions.offence.text,
      lookup(content.reference.offences, order.installationAndRisk?.offence),
      uri,
      answerOpts,
    ),
    createAnswer(
      questions.offenceAdditionalDetails.text,
      order.installationAndRisk?.offenceAdditionalDetails,
      uri,
      answerOpts,
    ),
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      order.installationAndRisk?.riskCategory?.map(category => lookup(content.reference.riskCategories, category)) ??
        [],
      uri,
      answerOpts,
    ),
    createAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, uri, answerOpts),
  ]
  if (config.mappa.enabled) {
    answers.push(
      createAnswer(
        questions.mappaLevel.text,
        lookup(content.reference.mappaLevel, order.installationAndRisk?.mappaLevel),
        uri,
        answerOpts,
      ),
      createAnswer(
        questions.mappaCaseType.text,
        lookup(content.reference.mappaCaseType, order.installationAndRisk?.mappaCaseType),
        uri,
        answerOpts,
      ),
    )
  }
  return {
    riskInformation: answers,
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default createViewModel
