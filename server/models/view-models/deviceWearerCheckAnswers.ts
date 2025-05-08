import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import {
  createBooleanAnswer,
  createDateAnswer,
  createMultipleChoiceAnswer,
  createAnswer,
} from '../../utils/checkYourAnswers'
import { formatDateTime, lookup } from '../../utils/utils'
import { Order } from '../Order'

const createOtherDisabilityAnswer = (order: Order, content: I18n, uri: string) => {
  if (order.deviceWearer.disabilities.includes('OTHER')) {
    return [
      createAnswer(content.pages.deviceWearer.questions.otherDisability.text, order.deviceWearer.otherDisability, uri, {
        ignoreActions: order.status === 'SUBMITTED',
      }),
    ]
  }

  return []
}

const createDeviceWearerAnswers = (order: Order, content: I18n) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  const disabilities = order.deviceWearer.disabilities.map(disability =>
    lookup(content.reference.disabilities, disability),
  )

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createAnswer(content.pages.deviceWearer.questions.firstName.text, order.deviceWearer.firstName, uri, answerOpts),
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
      order.deviceWearer.adultAtTimeOfInstallation,
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
    ...createOtherDisabilityAnswer(order, content, uri),
    createAnswer(content.pages.deviceWearer.questions.language.text, order.deviceWearer.language, uri, answerOpts),
    createBooleanAnswer(
      content.pages.deviceWearer.questions.interpreterRequired.text,
      order.deviceWearer.interpreterRequired,
      uri,
      answerOpts,
    ),
  ]
}

const createPersonIdentifierAnswers = (order: Order, content: I18n) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id)

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createAnswer(content.pages.identityNumbers.questions.nomisId.text, order.deviceWearer.nomisId, uri, answerOpts),
    createAnswer(content.pages.identityNumbers.questions.pncId.text, order.deviceWearer.pncId, uri, answerOpts),
    createAnswer(content.pages.identityNumbers.questions.deliusId.text, order.deviceWearer.deliusId, uri, answerOpts),
    createAnswer(
      content.pages.identityNumbers.questions.prisonNumber.text,
      order.deviceWearer.prisonNumber,
      uri,
      answerOpts,
    ),
    createAnswer(
      content.pages.identityNumbers.questions.homeOfficeReferenceNumber.text,
      order.deviceWearer.homeOfficeReferenceNumber,
      uri,
      answerOpts,
    ),
  ]
}

const createOtherRelationshipAnswer = (order: Order, content: I18n, uri: string) => {
  if (order.deviceWearerResponsibleAdult?.relationship === 'other') {
    return [
      createAnswer(
        content.pages.responsibleAdult.questions.otherRelationship.text,
        order.deviceWearerResponsibleAdult?.otherRelationshipDetails,
        uri,
        { ignoreActions: order.status === 'SUBMITTED' },
      ),
    ]
  }

  return []
}

const createResponsibeAdultAnswers = (order: Order, content: I18n) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id)

  if (order.deviceWearer.adultAtTimeOfInstallation === null) {
    return []
  }

  if (order.deviceWearer.adultAtTimeOfInstallation) {
    return []
  }

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createAnswer(
      content.pages.responsibleAdult.questions.relationship.text,
      lookup(content.reference.relationship, order.deviceWearerResponsibleAdult?.relationship),
      uri,
      answerOpts,
    ),
    ...createOtherRelationshipAnswer(order, content, uri),
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

const createViewModel = (order: Order, content: I18n) => ({
  deviceWearer: createDeviceWearerAnswers(order, content),
  personIdentifiers: createPersonIdentifierAnswers(order, content),
  responsibleAdult: createResponsibeAdultAnswers(order, content),
  submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
})

export default createViewModel
