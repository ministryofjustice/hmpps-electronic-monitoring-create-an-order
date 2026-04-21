import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import {
  createBooleanAnswer,
  createDateAnswer,
  createMultipleChoiceAnswer,
  createAnswer,
  AnswerOptions,
  createAddressAnswer,
} from '../../utils/checkYourAnswers'
import { formatDateTime, lookup } from '../../utils/utils'
import { Order } from '../Order'

const createOtherDisabilityAnswer = (order: Order, content: I18n, uri: string, answerOpts: AnswerOptions) => {
  if (order.deviceWearer.disabilities.includes('OTHER')) {
    return [
      createAnswer(
        content.pages.deviceWearer.questions.otherDisability.text,
        order.deviceWearer.otherDisability,
        uri,
        answerOpts,
      ),
    ]
  }

  return []
}

const createDeviceWearerAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  const disabilities = order.deviceWearer.disabilities.map(disability =>
    lookup(content.reference.disabilities, disability),
  )

  return [
    createAnswer(content.pages.deviceWearer.questions.firstName.text, order.deviceWearer.firstName, uri, answerOpts),
    createAnswer(content.pages.deviceWearer.questions.middleName.text, order.deviceWearer.middleName, uri, answerOpts),
    createAnswer(content.pages.deviceWearer.questions.lastName.text, order.deviceWearer.lastName, uri, answerOpts),
    createAnswer(content.pages.deviceWearer.questions.alias.text, order.deviceWearer.alias, uri, answerOpts),
    createDateAnswer(
      content.pages.deviceWearer.questions.dateOfBirth.text,
      order.deviceWearer.dateOfBirth,
      uri,
      answerOpts,
    ),
    createBooleanAnswer(
      content.pages.deviceWearer.questions.adultAtTimeOfInstallation.text,
      order.deviceWearer.adultAtTimeOfInstallation === null ? null : !order.deviceWearer.adultAtTimeOfInstallation,
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.deviceWearer.questions.sex.text,
      lookup(content.reference.sex, order.deviceWearer.sex),
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.deviceWearer.questions.gender.text,
      lookup(content.reference.gender, order.deviceWearer.gender),
      uri,
      answerOpts,
    ),
    createMultipleChoiceAnswer(content.pages.deviceWearer.questions.disabilities.text, disabilities, uri, answerOpts),
    ...createOtherDisabilityAnswer(order, content, uri, answerOpts),
    createAnswer(content.pages.deviceWearer.questions.language.text, order.deviceWearer.language, uri, answerOpts),
    createBooleanAnswer(
      content.pages.deviceWearer.questions.interpreterRequired.text,
      order.deviceWearer.interpreterRequired,
      uri,
      answerOpts,
    ),
  ]
}

const createPersonIdentifierAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id)

  return [
    createAnswer(content.pages.identityNumbers.questions.pncId.text, order.deviceWearer.pncId, uri, answerOpts),
    createAnswer(content.pages.identityNumbers.questions.nomisId.text, order.deviceWearer.nomisId, uri, answerOpts),
    createAnswer(
      content.pages.identityNumbers.questions.prisonNumber.text,
      order.deviceWearer.prisonNumber,
      uri,
      answerOpts,
    ),
    createAnswer(content.pages.identityNumbers.questions.deliusId.text, order.deviceWearer.deliusId, uri, answerOpts),
    createAnswer(
      content.pages.identityNumbers.questions.complianceAndEnforcementPersonReference.text,
      order.deviceWearer.complianceAndEnforcementPersonReference,
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.identityNumbers.questions.courtCaseReferenceNumber.text,
      order.deviceWearer.courtCaseReferenceNumber,
      uri,
      answerOpts,
    ),
  ]
}

const createOtherRelationshipAnswer = (order: Order, content: I18n, uri: string, answerOpts: AnswerOptions) => {
  if (order.deviceWearerResponsibleAdult?.relationship === 'other') {
    return [
      createAnswer(
        content.pages.responsibleAdult.questions.otherRelationship.text,
        order.deviceWearerResponsibleAdult?.otherRelationshipDetails,
        uri,
        answerOpts,
      ),
    ]
  }

  return []
}

const createResponsibeAdultAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id)

  if (order.deviceWearer.adultAtTimeOfInstallation === null) {
    return []
  }

  if (order.deviceWearer.adultAtTimeOfInstallation) {
    return []
  }

  return [
    createAnswer(
      content.pages.responsibleAdult.questions.relationship.text,
      lookup(content.reference.relationship, order.deviceWearerResponsibleAdult?.relationship),
      uri,
      answerOpts,
    ),
    ...createOtherRelationshipAnswer(order, content, uri, answerOpts),
    createAnswer(
      content.pages.responsibleAdult.questions.fullName.text,
      order.deviceWearerResponsibleAdult?.fullName,
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.responsibleAdult.questions.contactNumber.text,
      order.deviceWearerResponsibleAdult?.contactNumber,
      uri,
      answerOpts,
    ),
  ]
}

const createContactDetailsAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id)
  return [
    createBooleanAnswer(
      content.pages.contactDetails.questions.phoneNumberAvailable.text,
      order.contactDetails?.phoneNumberAvailable,
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.contactDetails.questions.contactNumber.text,
      order.contactDetails?.contactNumber,
      uri,
      answerOpts,
    ),
  ]
}

const createAddressAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const noFixedAbodeUri = paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id)
  const addressUri = paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', order.id)
  const primaryAddressUri = addressUri.replace(':addressType(primary|secondary|tertiary)', 'primary')
  const secondaryAddressUri = addressUri.replace(':addressType(primary|secondary|tertiary)', 'secondary')
  const tertiaryddressUri = addressUri.replace(':addressType(primary|secondary|tertiary)', 'tertiary')

  const primaryAddress = order.addresses.find(({ addressType }) => addressType === 'PRIMARY')
  const secondaryAddress = order.addresses.find(({ addressType }) => addressType === 'SECONDARY')
  const tertiaryAddress = order.addresses.find(({ addressType }) => addressType === 'TERTIARY')

  const answers = [
    createBooleanAnswer(
      content.pages.noFixedAbode.questions.noFixedAbode.text,
      order.deviceWearer.noFixedAbode === null ? null : !order.deviceWearer.noFixedAbode,
      noFixedAbodeUri,
      answerOpts,
    ),
  ]

  if (primaryAddress) {
    answers.push(
      createAddressAnswer(content.pages.primaryAddress.legend, primaryAddress, primaryAddressUri, answerOpts),
    )
  }

  if (secondaryAddress) {
    answers.push(
      createAddressAnswer(content.pages.secondaryAddress.legend, secondaryAddress, secondaryAddressUri, answerOpts),
    )
  }

  if (tertiaryAddress) {
    answers.push(
      createAddressAnswer(content.pages.tertiaryAddress.legend, tertiaryAddress, tertiaryddressUri, answerOpts),
    )
  }

  return answers
}

const createViewModel = (order: Order, content: I18n) => {
  const ignoreActions = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }
  return {
    deviceWearer: createDeviceWearerAnswers(order, content, ignoreActions),
    personIdentifiers: createPersonIdentifierAnswers(order, content, ignoreActions),
    responsibleAdult: createResponsibeAdultAnswers(order, content, ignoreActions),
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    contactDetails: createContactDetailsAnswers(order, content, ignoreActions),
    addresses: createAddressAnswers(order, content, ignoreActions),
  }
}

export default createViewModel
