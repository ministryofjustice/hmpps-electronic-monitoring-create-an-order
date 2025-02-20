import paths from '../../constants/paths'
import questions from '../../constants/questions'
import crownCourts from '../../reference/crown-courts'
import magistratesCourts from '../../reference/magistrates-courts'
import notifyingOrganisations from '../../reference/notifying-organisations'
import prisons from '../../reference/prisons'
import probationRegions from '../../reference/probation-regions'
import youthJusticeServiceRegions from '../../reference/youth-justice-service-regions'
import responsibleOrganisations from '../../reference/responsible-organisations'
import { createAddressAnswer, createBooleanAnswer, createTextAnswer } from '../../utils/checkYourAnswers'
import { lookup } from '../../utils/utils'
import { Order } from '../Order'

const createContactDetailsAnswers = (order: Order) => {
  const uri = paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id)
  return [createTextAnswer('Contact number', order.contactDetails?.contactNumber, uri)]
}

const createAddressAnswers = (order: Order) => {
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
      'Does the device wearer have a fixed address?',
      order.deviceWearer.noFixedAbode === null ? null : !order.deviceWearer.noFixedAbode,
      noFixedAbodeUri,
    ),
  ]

  if (primaryAddress) {
    answers.push(createAddressAnswer('Primary address', primaryAddress, primaryAddressUri))
  }

  if (secondaryAddress) {
    answers.push(createAddressAnswer('Secondary address', secondaryAddress, secondaryAddressUri))
  }

  if (tertiaryAddress) {
    answers.push(createAddressAnswer('Tertiary address', tertiaryAddress, tertiaryddressUri))
  }

  return answers
}

const getNotifyingOrganisationNameAnswer = (order: Order, uri: string) => {
  const notifyingOrganisation = order.interestedParties?.notifyingOrganisation

  if (notifyingOrganisation === 'PRISON') {
    return [
      createTextAnswer(
        questions.interestedParties.prison,
        lookup(prisons, order.interestedParties?.notifyingOrganisationName),
        uri,
      ),
    ]
  }

  if (notifyingOrganisation === 'CROWN_COURT') {
    return [
      createTextAnswer(
        questions.interestedParties.crownCourt,
        lookup(crownCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
      ),
    ]
  }

  if (notifyingOrganisation === 'MAGISTRATES_COURT') {
    return [
      createTextAnswer(
        questions.interestedParties.magistratesCourt,
        lookup(magistratesCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
      ),
    ]
  }

  return []
}

const getResponsibleOrganisationRegionAnswer = (order: Order, uri: string) => {
  const responsibleOrganisation = order.interestedParties?.responsibleOrganisation

  if (responsibleOrganisation === 'PROBATION') {
    return [
      createTextAnswer(
        questions.interestedParties.probationRegion,
        lookup(probationRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
      ),
    ]
  }

  if (responsibleOrganisation === 'YJS') {
    return [
      createTextAnswer(
        questions.interestedParties.yjsRegion,
        lookup(youthJusticeServiceRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
      ),
    ]
  }

  return []
}

const createInterestedPartiesAnswers = (order: Order) => {
  const uri = paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id)
  const responsibleOrganisationAddress = order.addresses.find(
    ({ addressType }) => addressType === 'RESPONSIBLE_ORGANISATION',
  )
  return [
    createTextAnswer(
      questions.interestedParties.notifyingOrganisation,
      lookup(notifyingOrganisations, order.interestedParties?.notifyingOrganisation),
      uri,
    ),
    ...getNotifyingOrganisationNameAnswer(order, uri),
    createTextAnswer(
      questions.interestedParties.notifyingOrganisationEmail,
      order.interestedParties?.notifyingOrganisationEmail,
      uri,
    ),
    createTextAnswer(
      questions.interestedParties.responsibleOfficerName,
      order.interestedParties?.responsibleOfficerName,
      uri,
    ),
    createTextAnswer(
      questions.interestedParties.responsibleOfficerPhoneNumber,
      order.interestedParties?.responsibleOfficerPhoneNumber,
      uri,
    ),
    createTextAnswer(
      questions.interestedParties.responsibleOrganisation,
      lookup(responsibleOrganisations, order.interestedParties?.responsibleOrganisation),
      uri,
    ),
    ...getResponsibleOrganisationRegionAnswer(order, uri),
    createAddressAnswer(
      questions.interestedParties.responsibleOrganisationAddress,
      responsibleOrganisationAddress,
      uri,
    ),
    createTextAnswer(
      questions.interestedParties.responsibleOrganisationPhoneNumber,
      order.interestedParties?.responsibleOrganisationPhoneNumber,
      uri,
    ),
    createTextAnswer(
      questions.interestedParties.responsibleOrganisationEmail,
      order.interestedParties?.responsibleOrganisationEmail,
      uri,
    ),
  ]
}

const createViewModel = (order: Order) => ({
  contactDetails: createContactDetailsAnswers(order),
  addresses: createAddressAnswers(order),
  interestedParties: createInterestedPartiesAnswers(order),
})

export default createViewModel
