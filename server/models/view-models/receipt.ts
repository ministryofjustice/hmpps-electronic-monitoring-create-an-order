import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import * as RiskInformationCheckAnswers from './riskInformationCheckAnswers'
import * as AdditionalDocumentsCheckAnswers from './additionalDocumentsCheckAnswers'
import * as VariationDetailsCheckAnswers from './variationDetailsCheckAnswers'
import { createAnswer, createDateTimeAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import FeatureFlags from '../../utils/featureFlags'

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

const getOrderTypeName = (
  type:
    | 'REQUEST'
    | 'VARIATION'
    | 'REJECTED'
    | 'AMEND_ORIGINAL_REQUEST'
    | 'REINSTALL_AT_DIFFERENT_ADDRESS'
    | 'REINSTALL_DEVICE'
    | 'REVOCATION'
    | 'END_MONITORING',
) => {
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
    case 'REINSTALL_AT_DIFFERENT_ADDRESS': {
      return 'Reinstall at different address'
    }
    case 'REINSTALL_DEVICE': {
      return 'Reinstall device'
    }
    case 'REVOCATION': {
      return 'Revocation'
    }
    case 'END_MONITORING': {
      return 'End all monitoring'
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
    showDownloadJsonButtons: FeatureFlags.getInstance().get('DOWNLOAD_FMS_REQUEST_JSON_ENABLED'),
  }
}

export default createViewModel
