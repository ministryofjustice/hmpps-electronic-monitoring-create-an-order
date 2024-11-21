import { responsibleOrganisationMap } from '../../constants/contact-information/interested-parties'
import paths from '../../constants/paths'
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

const createInterestedPartiesAnswers = (order: Order) => {
  const uri = paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id)
  const responsibleOrganisationAddress = order.addresses.find(
    ({ addressType }) => addressType === 'RESPONSIBLE_ORGANISATION',
  )
  return [
    createTextAnswer(
      'What is the email address for your team?',
      order.interestedParties?.notifyingOrganisationEmail,
      uri,
    ),
    createTextAnswer('Full name of responsible officer', order.interestedParties?.responsibleOfficerName, uri),
    createTextAnswer(
      'Telephone number for responsible officer',
      order.interestedParties?.responsibleOfficerPhoneNumber,
      uri,
    ),
    createTextAnswer(
      'What organisation is the responsible officer part of?',
      lookup(responsibleOrganisationMap, order.interestedParties?.responsibleOrganisation),
      uri,
    ),
    createTextAnswer(
      'What region is the responsible organisation in? (optional)',
      order.interestedParties?.responsibleOrganisationRegion,
      uri,
    ),
    createAddressAnswer('What is the address of the responsible organisation?', responsibleOrganisationAddress, uri),
    createTextAnswer(
      'Telephone number for responsible organisation',
      order.interestedParties?.responsibleOrganisationPhoneNumber,
      uri,
    ),
    createTextAnswer(
      'Email address for responsible organisation',
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
