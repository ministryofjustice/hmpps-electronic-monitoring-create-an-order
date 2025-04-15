import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import Answer, { createTextAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import AttachmentType from '../AttachmentType'

type CheckYourAnswerViewModel = {
  [field: string]: Answer[] | Answer[][]
}
const removeActionItems = (viewModel: CheckYourAnswerViewModel) =>
  Object.values(viewModel).forEach(answers => removeAnswerActionItems(answers))

const removeAnswerActionItems = (answers: Answer[] | Answer[][]) => {
  // using for loop here to bypass ESLint rule no-param-reassign
  for (let index = 0; index < answers.length; index += 1) {
    const answer = answers[index]
    if ('actions' in answer) {
      answer.actions.items = []
    } else {
      removeAnswerActionItems(answer)
    }
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

const createRiskInformationAnswers = (order: Order, content: I18n) => {
  const { questions } = content.pages.installationAndRisk
  const answers = [
    createTextAnswer(questions.offence.text, order.installationAndRisk?.offence, ''),
    createTextAnswer(questions.riskCategory.text, order.installationAndRisk?.riskCategory?.join(','), ''),
    createTextAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, ''),
    createTextAnswer(questions.mappaLevel.text, order.installationAndRisk?.mappaLevel, ''),
    createTextAnswer(questions.mappaCaseType.text, order.installationAndRisk?.mappaCaseType, ''),
  ]
  return answers
}

const createAdditionalDocumentAnswers = (order: Order) => {
  const licence = order.additionalDocuments.find(x => x.fileType === AttachmentType.LICENCE)
  const photo = order.additionalDocuments.find(x => x.fileType === AttachmentType.PHOTO_ID)
  const answers = [
    createTextAnswer('Licence', licence?.fileName ?? 'No licence document uploaded', ''),
    createTextAnswer('Photo identification (optional)', photo?.fileName ?? 'No photo ID document uploaded', ''),
  ]
  return answers
}

const createViewModel = (order: Order, content: I18n) => {
  const statusDetails = createOrderStatusAnswers(order)
  const contactInformation = ContactInformationCheckAnswers.default(order, content)
  const devicewearer = DeviceWearerCheckAnswers.default(order, content)
  const monitoringConditions = MonitoringConditionsCheckAnswers.default(order, content)
  const riskDetails = createRiskInformationAnswers(order, content)
  const additionalDocumentDetails = createAdditionalDocumentAnswers(order)
  removeActionItems(contactInformation)
  removeActionItems(devicewearer)
  removeActionItems(monitoringConditions)
  removeAnswerActionItems(statusDetails)
  removeAnswerActionItems(riskDetails)
  removeAnswerActionItems(additionalDocumentDetails)
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
