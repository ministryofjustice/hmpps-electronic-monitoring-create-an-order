import paths from '../../constants/paths'
import { createAddressAnswer, createBooleanAnswer, createAnswer, AnswerOptions } from '../../utils/checkYourAnswers'
import { formatDateTime, lookup } from '../../utils/utils'
import { Order } from '../Order'
import I18n from '../../types/i18n'

const createContactDetailsAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id)
  return [
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

const getNotifyingOrganisationNameAnswer = (order: Order, content: I18n, uri: string, answerOpts: AnswerOptions) => {
  const notifyingOrganisation = order.interestedParties?.notifyingOrganisation
  const { questions } = content.pages.interestedParties

  if (notifyingOrganisation === 'PRISON') {
    return [
      createAnswer(
        questions.prison.text,
        lookup(content.reference.prisons, order.interestedParties?.notifyingOrganisationName),
        uri,
        answerOpts,
      ),
    ]
  }

  if (notifyingOrganisation === 'CROWN_COURT') {
    return [
      createAnswer(
        questions.crownCourt.text,
        lookup(content.reference.crownCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
        answerOpts,
      ),
    ]
  }

  if (notifyingOrganisation === 'MAGISTRATES_COURT') {
    return [
      createAnswer(
        questions.magistratesCourt.text,
        lookup(content.reference.magistratesCourts, order.interestedParties?.notifyingOrganisationName),
        uri,
        answerOpts,
      ),
    ]
  }

  return []
}

const getResponsibleOrganisationRegionAnswer = (
  order: Order,
  content: I18n,
  uri: string,
  answerOpts: AnswerOptions,
) => {
  const responsibleOrganisation = order.interestedParties?.responsibleOrganisation
  const { questions } = content.pages.interestedParties

  if (responsibleOrganisation === 'PROBATION') {
    return [
      createAnswer(
        questions.probationRegion.text,
        lookup(content.reference.probationRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
        answerOpts,
      ),
    ]
  }

  if (responsibleOrganisation === 'YJS') {
    return [
      createAnswer(
        questions.yjsRegion.text,
        lookup(content.reference.youthJusticeServiceRegions, order.interestedParties?.responsibleOrganisationRegion),
        uri,
        answerOpts,
      ),
    ]
  }

  return []
}

const createInterestedPartiesAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id)

  const { questions } = content.pages.interestedParties

  return [
    createAnswer(
      questions.notifyingOrganisation.text,
      lookup(content.reference.notifyingOrganisations, order.interestedParties?.notifyingOrganisation),
      uri,
      answerOpts,
    ),
    ...getNotifyingOrganisationNameAnswer(order, content, uri, answerOpts),
    createAnswer(
      questions.notifyingOrganisationEmail.text,
      order.interestedParties?.notifyingOrganisationEmail,
      uri,
      answerOpts,
    ),
    createAnswer(
      questions.responsibleOfficerName.text,
      order.interestedParties?.responsibleOfficerName,
      uri,
      answerOpts,
    ),
    createAnswer(
      questions.responsibleOfficerPhoneNumber.text,
      order.interestedParties?.responsibleOfficerPhoneNumber,
      uri,
      answerOpts,
    ),
    createAnswer(
      questions.responsibleOrganisation.text,
      lookup(content.reference.responsibleOrganisations, order.interestedParties?.responsibleOrganisation),
      uri,
      answerOpts,
    ),
    ...getResponsibleOrganisationRegionAnswer(order, content, uri, answerOpts),
    createAnswer(
      questions.responsibleOrganisationEmail.text,
      order.interestedParties?.responsibleOrganisationEmail,
      uri,
      answerOpts,
    ),
  ]
}

const createViewModel = (order: Order, content: I18n) => {
  const answerOpts = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }
  return {
    contactDetails: createContactDetailsAnswers(order, content, answerOpts),
    addresses: createAddressAnswers(order, content, answerOpts),
    interestedParties: createInterestedPartiesAnswers(order, content, answerOpts),
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default createViewModel
