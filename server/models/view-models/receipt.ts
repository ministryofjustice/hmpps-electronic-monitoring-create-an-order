import * as DeviceWearerCheckAnswers from '../../routes/about-the-device-wearer/check-your-answers/viewModel'
import * as MonitoringConditionsCheckAnswers from '../../routes/monitoring-conditions/check-your-answers/viewModel'
import * as RiskInformationCheckAnswers from '../../routes/installation-and-risk/check-your-answers/viewModel'
import * as AdditionalDocumentsCheckAnswers from '../../routes/attachments/additional-documents/viewModel'
import * as VariationDetailsCheckAnswers from './variationDetailsCheckAnswers'
import InterestedPartiesCheckAnswers from '../../routes/interested-parties/check-your-answers/viewModel'
import { Answer, createAnswer, createDateTimeAnswer } from '../../utils/checkYourAnswers'

import { Order, OrderStatus, OrderType } from '../Order'
import I18n from '../../types/i18n'
import FeatureFlags from '../../utils/featureFlags'
import { isNotNullOrEmptyString } from '../../utils/utils'
import isVariationType from '../../utils/isVariationType'

const createOrderStatusAnswers = (order: Order) => {
  const answerOpts = { ignoreActions: true }
  const answers: Answer[] = []
  answers.push(createAnswer('Status', order.status, '', answerOpts))
  answers.push(createAnswer('Type', getOrderTypeName(order.type, order.status), '', answerOpts))

  if (isVariationType(order.type)) {
    answers.push(createAnswer('Type of Change', getTypeOfChange(order.type), '', answerOpts))
  }
  answers.push(createAnswer('Reference number', order.id, '', answerOpts))
  answers.push(createDateTimeAnswer('Date submitted', order.fmsResultDate, '', answerOpts))
  answers.push(createAnswer('Submitted by', order.submittedBy, '', answerOpts))
  answers.push(
    createAnswer('Notifying organisation', order.interestedParties?.notifyingOrganisation || '', '', answerOpts),
  )
  answers.push(
    createAnswer(
      "Notifying organisation's name or region",
      order.interestedParties?.notifyingOrganisationName || '',
      '',
      answerOpts,
    ),
  )
  answers.push(
    createAnswer(
      "Notifying organisation's contact email address",
      order.interestedParties?.notifyingOrganisationEmail || '',
      '',
      answerOpts,
    ),
  )

  return answers
}
const getTypeOfChange = (type: OrderType) => {
  switch (type) {
    case 'VARIATION':
      return 'Other change'
    case 'REINSTALL_AT_DIFFERENT_ADDRESS':
      return 'Added second or third curfew address'
    case 'REINSTALL_DEVICE':
      return 'Changed primary address'
    case 'REVOCATION':
      return 'Ended (Recall)'
    case 'END_MONITORING':
      return 'Ended'
    default: {
      return ''
    }
  }
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
  status: OrderStatus,
) => {
  switch (type) {
    case 'AMEND_ORIGINAL_REQUEST':
    case 'REQUEST': {
      if (status === 'IN_PROGRESS') {
        return 'Draft order'
      }
      return 'Order Submitted'
    }
    case 'REJECTED': {
      return 'Form returned'
    }
    case 'VARIATION':
    case 'REINSTALL_AT_DIFFERENT_ADDRESS':
    case 'REINSTALL_DEVICE': {
      if (status === 'IN_PROGRESS') {
        return 'Changes to an order'
      }
      return 'Changes submitted'
    }
    case 'REVOCATION':
    case 'END_MONITORING': {
      if (status === 'IN_PROGRESS') {
        return 'Changes to an order'
      }
      return 'Monitoring ended'
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
  const interestedParties = InterestedPartiesCheckAnswers.construct(order, content, false)
  const devicewearer = DeviceWearerCheckAnswers.default(order, content, false)
  const monitoringConditions = MonitoringConditionsCheckAnswers.default(order, content, false)
  const riskDetails = RiskInformationCheckAnswers.default(order, content, false)
  const additionalDocumentDetails = AdditionalDocumentsCheckAnswers.default(order, content)
  const variationDetails = VariationDetailsCheckAnswers.default(order, content)

  return {
    statusDetails,
    ...interestedParties,
    ...devicewearer,
    ...monitoringConditions,
    ...riskDetails,
    ...variationDetails,
    additionalDocumentDetails,
    showDownloadJsonButtons: FeatureFlags.getInstance().get('DOWNLOAD_FMS_REQUEST_JSON_ENABLED'),
    showResponsibleOrgSection,
  }
}

export default createViewModel
