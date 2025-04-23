import { disabilitiesMap } from '../../constants/about-the-device-wearer'
import paths from '../../constants/paths'
import I18n from '../../types/i18n'
import {
  createBooleanAnswer,
  createDateAnswer,
  createMultipleChoiceAnswer,
  createTextAnswer,
} from '../../utils/checkYourAnswers'
import { lookup } from '../../utils/utils'
import { Order } from '../Order'

const createOtherDisabilityAnswer = (order: Order, content: I18n, uri: string) => {
  if (order.deviceWearer.disabilities.includes('OTHER')) {
    return [
      createTextAnswer(
        content.pages.deviceWearer.questions.otherDisability.text,
        order.deviceWearer.otherDisability,
        uri,
      ),
    ]
  }

  return []
}

const createDeviceWearerAnswers = (order: Order, content: I18n) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  const disabilities = order.deviceWearer.disabilities.map(disability => lookup(disabilitiesMap, disability))
  return [
    createTextAnswer(content.pages.deviceWearer.questions.firstName.text, order.deviceWearer.firstName, uri),
    createTextAnswer(content.pages.deviceWearer.questions.lastName.text, order.deviceWearer.lastName, uri),
    createTextAnswer(content.pages.deviceWearer.questions.alias.text, order.deviceWearer.alias, uri),
    createDateAnswer(content.pages.deviceWearer.questions.dateOfBirth.text, order.deviceWearer.dateOfBirth, uri),
    createBooleanAnswer(
      content.pages.deviceWearer.questions.adultAtTimeOfInstallation.text,
      order.deviceWearer.adultAtTimeOfInstallation,
      uri,
    ),
    createTextAnswer(
      content.pages.deviceWearer.questions.sex.text,
      lookup(content.reference.sex, order.deviceWearer.sex),
      uri,
    ),
    createTextAnswer(
      content.pages.deviceWearer.questions.gender.text,
      lookup(content.reference.gender, order.deviceWearer.gender),
      uri,
    ),
    createMultipleChoiceAnswer(content.pages.deviceWearer.questions.disabilities.text, disabilities, uri),
    ...createOtherDisabilityAnswer(order, content, uri),
    createTextAnswer(content.pages.deviceWearer.questions.language.text, order.deviceWearer.language, uri),
    createBooleanAnswer(
      content.pages.deviceWearer.questions.interpreterRequired.text,
      order.deviceWearer.interpreterRequired,
      uri,
    ),
  ]
}

const createPersonIdentifierAnswers = (order: Order, content: I18n) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  return [
    createTextAnswer(content.pages.identityNumbers.questions.nomisId.text, order.deviceWearer.nomisId, uri),
    createTextAnswer(content.pages.identityNumbers.questions.pncId.text, order.deviceWearer.pncId, uri),
    createTextAnswer(content.pages.identityNumbers.questions.deliusId.text, order.deviceWearer.deliusId, uri),
    createTextAnswer(content.pages.identityNumbers.questions.prisonNumber.text, order.deviceWearer.prisonNumber, uri),
    createTextAnswer(
      content.pages.identityNumbers.questions.homeOfficeReferenceNumber.text,
      order.deviceWearer.homeOfficeReferenceNumber,
      uri,
    ),
  ]
}

const createOtherRelationshipAnswer = (order: Order, content: I18n, uri: string) => {
  if (order.deviceWearerResponsibleAdult?.relationship === 'other') {
    return [
      createTextAnswer(
        content.pages.responsibleAdult.questions.otherRelationship.text,
        order.deviceWearerResponsibleAdult?.otherRelationshipDetails,
        uri,
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

  return [
    createTextAnswer(
      content.pages.responsibleAdult.questions.relationship.text,
      lookup(content.reference.relationship, order.deviceWearerResponsibleAdult?.relationship),
      uri,
    ),
    ...createOtherRelationshipAnswer(order, content, uri),
    createTextAnswer(
      content.pages.responsibleAdult.questions.fullName.text,
      order.deviceWearerResponsibleAdult?.fullName,
      uri,
    ),
    createTextAnswer(
      content.pages.responsibleAdult.questions.contactNumber.text,
      order.deviceWearerResponsibleAdult?.contactNumber,
      uri,
    ),
  ]
}

const createViewModel = (order: Order, content: I18n) => ({
  deviceWearer: createDeviceWearerAnswers(order, content),
  personIdentifiers: createPersonIdentifierAnswers(order, content),
  responsibleAdult: createResponsibeAdultAnswers(order, content),
})

export default createViewModel
