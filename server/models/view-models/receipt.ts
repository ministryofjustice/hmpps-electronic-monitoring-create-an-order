import * as ContactInformationCheckAnswers from './contactInformationCheckAnswers'
import * as DeviceWearerCheckAnswers from './deviceWearerCheckAnswers'
import * as MonitoringConditionsCheckAnswers from './monitoringConditionsCheckAnswers'
import * as RiskInformationCheckAnswers from './riskInformationCheckAnswers'
import * as AdditionalDocumentsCheckAnswers from './additionalDocumentsCheckAnswers'
import * as VariationDetailsCheckAnswers from './variationDetailsCheckAnswers'
import InterestedPartiesCheckAnswers from '../../routes/interested-parties/check-your-answers/viewModel'
import { createAnswer, createDateTimeAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import FeatureFlags from '../../utils/featureFlags'
import { isNotNullOrEmptyString } from '../../utils/utils'

const createOrderStatusAnswers = (order: Order) => {
  const answerOpts = { ignoreActions: true }
  const answers = [
    createAnswer('Status', order.status, '', answerOpts),
    createAnswer('Type', getOrderTypeName(order.type), '', answerOpts),
    createAnswer('Reference number', order.id, '', answerOpts),
    createDateTimeAnswer('Date submitted', order.fmsResultDate, '', answerOpts),
    createAnswer('Submitted by', order.submittedBy, '', answerOpts),
    createAnswer('Notifying organisation', order.interestedParties?.notifyingOrganisation || '', '', answerOpts),
    createAnswer(
      "Notifying organisation's name or region",
      order.interestedParties?.notifyingOrganisationName || '',
      '',
      answerOpts,
    ),
    createAnswer(
      "Notifying organisation's contact email address",
      order.interestedParties?.notifyingOrganisationEmail || '',
      '',
      answerOpts,
    ),
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
  const showResponsibleOrgSection = !(
    order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE' ||
    (!isNotNullOrEmptyString(order.interestedParties?.responsibleOrganisation) &&
      !isNotNullOrEmptyString(order.interestedParties?.responsibleOfficerFirstName))
  )

  const statusDetails = createOrderStatusAnswers(order)
  const isInterestedPartiesFlowEnabled = FeatureFlags.getInstance().get('INTERESTED_PARTIES_FLOW_ENABLED')
  const interestedParties = InterestedPartiesCheckAnswers.construct(order, content)
  const contactInformation = ContactInformationCheckAnswers.default(order, content)
  const devicewearer = DeviceWearerCheckAnswers.default(order, content)
  const monitoringConditions = MonitoringConditionsCheckAnswers.default(order, content)
  const riskDetails = RiskInformationCheckAnswers.default(order, content)
  const additionalDocumentDetails = AdditionalDocumentsCheckAnswers.default(order, content)
  const variationDetails = VariationDetailsCheckAnswers.default(order, content)

  return {
    statusDetails,
    ...(isInterestedPartiesFlowEnabled ? interestedParties : contactInformation),
    ...devicewearer,
    ...monitoringConditions,
    ...riskDetails,
    ...variationDetails,
    additionalDocumentDetails,
    showDownloadJsonButtons: FeatureFlags.getInstance().get('DOWNLOAD_FMS_REQUEST_JSON_ENABLED'),
    isInterestedPartiesFlowEnabled,
    showResponsibleOrgSection,
  }
}

export default createViewModel
