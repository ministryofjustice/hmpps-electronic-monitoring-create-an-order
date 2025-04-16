import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import * as RiskInformationCheckAnswers from './riskInformationCheckAnswers'
import * as AdditionalDocumentsCheckAnswers from './additionalDocumentsCheckAnswers'
import Answer, { createTextAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'

type CheckYourAnswerViewModel = {
  [field: string]: Answer[] | Answer[][]
}
const removeModelActionItems = (viewModel: CheckYourAnswerViewModel): CheckYourAnswerViewModel => {
  const result: CheckYourAnswerViewModel = {}
  Object.keys(viewModel).forEach(key => {
    result[key] = removeAnswerActionItems(viewModel[key])
  })
  return result
}

const removeAnswerActionItems = (answers: Answer[] | Answer[][]): Answer[] | Answer[][] => {
  return answers.flatMap(answer => {
    if (Array.isArray(answer)) {
      return answer.flatMap(entry => duplicateAnswerWithNoActions(entry))
    }
    return duplicateAnswerWithNoActions(answer)
  })
}

const duplicateAnswerWithNoActions = (answer: Answer): Answer => {
  return {
    key: {
      text: answer.key.text,
    },
    value: {
      text: answer.value.text,
      html: answer.value.html,
    },
    actions: {
      items: [],
    },
  }
}

const createOrderStatusAnswers = (order: Order) => {
  const answers = [
    createTextAnswer('Status', order.status, ''),
    createTextAnswer('Type', order.type, ''),
    createTextAnswer('Reference number', order.id, ''),
  ]
  return answers
}

const createViewModel = (order: Order, content: I18n) => {
  const statusDetails = removeAnswerActionItems(createOrderStatusAnswers(order))
  const contactInformation = removeModelActionItems(ContactInformationCheckAnswers.default(order, content))
  const devicewearer = removeModelActionItems(DeviceWearerCheckAnswers.default(order, content))
  const monitoringConditions = removeModelActionItems(MonitoringConditionsCheckAnswers.default(order, content))
  const riskDetails = removeAnswerActionItems(RiskInformationCheckAnswers.default(order, content))
  const additionalDocumentDetails = removeAnswerActionItems(AdditionalDocumentsCheckAnswers.default(order))

  return {
    statusDetails,
    ...contactInformation,
    ...devicewearer,
    ...monitoringConditions,
    riskDetails,
    additionalDocumentDetails,
  }
}

export default createViewModel
