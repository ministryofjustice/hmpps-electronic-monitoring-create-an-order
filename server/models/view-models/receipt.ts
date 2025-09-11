import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import * as RiskInformationCheckAnswers from './riskInformationCheckAnswers'
import * as AdditionalDocumentsCheckAnswers from './additionalDocumentsCheckAnswers'
import * as VariationDetailsCheckAnswers from './variationDetailsCheckAnswers'
import { createAnswer, createDateTimeAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'

const createOrderStatusAnswers = (order: Order) => {
  const answerOpts = { ignoreActions: true }
  const answers = [
    createAnswer('Status', order.status, '', answerOpts),
    createAnswer('Type', getOrderTypeName(order.type), '', answerOpts),
    createAnswer('Reference number', order.id, '', answerOpts),
    createDateTimeAnswer('Date submitted', order.fmsResultDate, '', answerOpts),
    createAnswer('Submitted by', order.submittedBy, '', answerOpts),
  ]
  return answers
}

const getOrderTypeName = (type: 'REQUEST' | 'VARIATION' | 'REJECTED' | 'AMEND_ORIGINAL_REQUEST') => {
  switch (type) {
    case 'REQUEST': {
      return 'New order'
    }
    case 'VARIATION': {
      return 'Change to an order'
    }
    case 'REJECTED': {
      return 'Rejected order'
    }
    case 'AMEND_ORIGINAL_REQUEST': {
      return 'New order (original order was rejected)'
    }
    default: {
      return ''
    }
  }
}

const createViewModel = (order: Order, content: I18n) => {
  const statusDetails = createOrderStatusAnswers(order)
  const contactInformation = ContactInformationCheckAnswers.default(order, content)
  const devicewearer = DeviceWearerCheckAnswers.default(order, content)
  const monitoringConditions = MonitoringConditionsCheckAnswers.default(order, content)
  const riskDetails = RiskInformationCheckAnswers.default(order, content)
  const additionalDocumentDetails = AdditionalDocumentsCheckAnswers.default(order, content)
  const variationDetails = VariationDetailsCheckAnswers.default(order, content)

  return {
    statusDetails,
    ...contactInformation,
    ...devicewearer,
    ...monitoringConditions,
    ...riskDetails,
    ...variationDetails,
    additionalDocumentDetails,
  }
}

export default createViewModel
