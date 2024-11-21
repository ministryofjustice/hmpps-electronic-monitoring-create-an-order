import { disabilitiesMap, genderMap, sexMap } from '../../constants/about-the-device-wearer'
import { relationshipMap } from '../../constants/about-the-device-wearer/responsibleAdult'
import paths from '../../constants/paths'
import {
  createBooleanAnswer,
  createDateAnswer,
  createMultipleChoiceAnswer,
  createTextAnswer,
} from '../../utils/checkYourAnswers'
import { lookup } from '../../utils/utils'
import { Order } from '../Order'

const createDeviceWearerAnswers = (order: Order) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  const disabilities = order.deviceWearer.disabilities.map(disability => lookup(disabilitiesMap, disability))
  return [
    createTextAnswer('First names', order.deviceWearer.firstName, uri),
    createTextAnswer('Last name', order.deviceWearer.lastName, uri),
    createTextAnswer('Preferred name or alias (optional)', order.deviceWearer.alias, uri),
    createDateAnswer('Date of birth', order.deviceWearer.dateOfBirth, uri),
    createBooleanAnswer(
      'Will the device wearer be 18 years old when the device is installed?',
      order.deviceWearer.adultAtTimeOfInstallation,
      uri,
    ),
    createTextAnswer('Sex', lookup(sexMap, order.deviceWearer.sex), uri),
    createTextAnswer('Gender', lookup(genderMap, order.deviceWearer.gender), uri),
    createMultipleChoiceAnswer('Disabilities (optional)', disabilities, uri),
    createTextAnswer('Disability, if other (optional)', order.deviceWearer.otherDisability, uri),
    createTextAnswer('Main language', order.deviceWearer.language, uri),
    createBooleanAnswer('Is an interpreter required?', order.deviceWearer.interpreterRequired, uri),
  ]
}

const createPersonIdentifierAnswers = (order: Order) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id)
  return [
    createTextAnswer('NOMIS ID (optional)', order.deviceWearer.nomisId, uri),
    createTextAnswer('PNC ID (optional)', order.deviceWearer.pncId, uri),
    createTextAnswer('DELIUS ID (optional)', order.deviceWearer.deliusId, uri),
    createTextAnswer('Prison number (optional)', order.deviceWearer.prisonNumber, uri),
    createTextAnswer('Home Office reference number (optional)', order.deviceWearer.homeOfficeReferenceNumber, uri),
  ]
}

const createResponsibeAdultAnswers = (order: Order) => {
  const uri = paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id)

  if (order.deviceWearer.adultAtTimeOfInstallation === null) {
    return []
  }

  if (order.deviceWearer.adultAtTimeOfInstallation) {
    return []
  }

  return [
    createTextAnswer('Relationship', lookup(relationshipMap, order.deviceWearerResponsibleAdult?.relationship), uri),
    createTextAnswer(
      'Relationship details, if other (optional)',
      order.deviceWearerResponsibleAdult?.otherRelationshipDetails,
      uri,
    ),
    createTextAnswer('Full name', order.deviceWearerResponsibleAdult?.fullName, uri),
    createTextAnswer('Contact number', order.deviceWearerResponsibleAdult?.contactNumber, uri),
  ]
}

const createViewModel = (order: Order) => ({
  deviceWearer: createDeviceWearerAnswers(order),
  personIdentifiers: createPersonIdentifierAnswers(order),
  responsibleAdult: createResponsibeAdultAnswers(order),
})

export default createViewModel
