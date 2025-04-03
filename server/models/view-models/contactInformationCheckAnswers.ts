import paths from '../../constants/paths'
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
import I18n from '../../types/i18n'

const createContactDetailsAnswers = (order: Order, content: I18n) => {
  const uri = paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id)
  return [
    createTextAnswer(
      content.pages.contactDetails.questions.contactNumber.text,
      order.contactDetails?.contactNumber,
      uri,
    ),
  ]
}

const createAddressAnswers = (order: Order, content: I18n) => {
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
    ),
  ]

  if (primaryAddress) {
    answers.push(createAddressAnswer(content.pages.primaryAddress.legend, primaryAddress, primaryAddressUri))
  }

  if (secondaryAddress) {
    answers.push(createAddressAnswer(content.pages.secondaryAddress.legend, secondaryAddress, secondaryAddressUri))
  }

  if (tertiaryAddress) {
    answers.push(createAddressAnswer(content.pages.tertiaryAddress.legend, tertiaryAddress, tertiaryddressUri))
  }

  return answers
}

const getNotifyingOrganisationNameAnswer = (order: Order, content: I18n, uri: string) => {
  const notifyingOrganisation = order.interestedParties?.notifyingOrganisation
  const { questions } = content.pages.interestedParties
  if (notifyingOrganisation === 'PRISON') {
    return [
      createTextAnswer(questions.prison.text, lookup(prisons, order.interestedParties?.notifyingOrganisationName), uri),
    ]
  }

  if (notifyingOrganisation === 'CROWN_COURT') {
    return [
      createTextAnswer(
        questions.crownCourt.text,
        lookup(crownCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
      ),
    ]
  }

  if (notifyingOrganisation === 'MAGISTRATES_COURT') {
    return [
      createTextAnswer(
        questions.magistratesCourt.text,
        lookup(magistratesCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
      ),
    ]
  }

  return []
}

const getResponsibleOrganisationRegionAnswer = (order: Order, content: I18n, uri: string) => {
  const responsibleOrganisation = order.interestedParties?.responsibleOrganisation
  const { questions } = content.pages.interestedParties
  if (responsibleOrganisation === 'PROBATION') {
    return [
      createTextAnswer(
        questions.probationRegion.text,
        lookup(probationRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
      ),
    ]
  }

  if (responsibleOrganisation === 'YJS') {
    return [
      createTextAnswer(
        questions.yjsRegion.text,
        lookup(youthJusticeServiceRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
      ),
    ]
  }

  return []
}

const createInterestedPartiesAnswers = (order: Order, content: I18n) => {
  const uri = paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id)
  const responsibleOrganisationAddress = order.addresses.find(
    ({ addressType }) => addressType === 'RESPONSIBLE_ORGANISATION',
  )
  const { questions } = content.pages.interestedParties
  return [
    createTextAnswer(
      questions.notifyingOrganisation.text,
      lookup(notifyingOrganisations, order.interestedParties?.notifyingOrganisation),
      uri,
    ),
    ...getNotifyingOrganisationNameAnswer(order, content, uri),
    createTextAnswer(
      questions.notifyingOrganisationEmail.text,
      order.interestedParties?.notifyingOrganisationEmail,
      uri,
    ),
    createTextAnswer(questions.responsibleOfficerName.text, order.interestedParties?.responsibleOfficerName, uri),
    createTextAnswer(
      questions.responsibleOfficerPhoneNumber.text,
      order.interestedParties?.responsibleOfficerPhoneNumber,
      uri,
    ),
    createTextAnswer(
      questions.responsibleOrganisation.text,
      lookup(responsibleOrganisations, order.interestedParties?.responsibleOrganisation),
      uri,
    ),
    ...getResponsibleOrganisationRegionAnswer(order, content, uri),
    createAddressAnswer(questions.responsibleOrganisationAddress.text, responsibleOrganisationAddress, uri),
    createTextAnswer(
      questions.responsibleOrganisationPhoneNumber.text,
      order.interestedParties?.responsibleOrganisationPhoneNumber,
      uri,
    ),
    createTextAnswer(
      questions.responsibleOrganisationEmail.text,
      order.interestedParties?.responsibleOrganisationEmail,
      uri,
    ),
  ]
}

const createViewModel = (order: Order, content: I18n) => ({
  contactDetails: createContactDetailsAnswers(order, content),
  addresses: createAddressAnswers(order, content),
  interestedParties: createInterestedPartiesAnswers(order, content),
})

export default createViewModel
