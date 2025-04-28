import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import * as RiskInformationCheckAnswers from './riskInformationCheckAnswers'
import * as AdditionalDocumentsCheckAnswers from './additionalDocumentsCheckAnswers'
import { createTextAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'

const createOrderStatusAnswers = (order: Order) => {
  const answers = [
    createTextAnswer('Status', order.status, ''),
    createTextAnswer('Type', order.type, ''),
    createTextAnswer('Reference number', order.id, ''),
  ]
  return answers
}

const createViewModel = (order: Order, content: I18n) => {
  const statusDetails = createOrderStatusAnswers(order)
  const contactInformation = ContactInformationCheckAnswers.default(order, content)
  const devicewearer = DeviceWearerCheckAnswers.default(order, content)
  const monitoringConditions = MonitoringConditionsCheckAnswers.default(order, content)
  const riskDetails = RiskInformationCheckAnswers.default(order, content)
  const additionalDocumentDetails = AdditionalDocumentsCheckAnswers.default(order)

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
