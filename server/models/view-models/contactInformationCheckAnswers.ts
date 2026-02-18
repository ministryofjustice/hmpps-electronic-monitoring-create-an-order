import paths from '../../constants/paths'
import { createAddressAnswer, createBooleanAnswer, createAnswer, AnswerOptions } from '../../utils/checkYourAnswers'
import { formatDateTime, lookup } from '../../utils/utils'
import { Order } from '../Order'
import I18n from '../../types/i18n'
import { ReferenceCatalogDDv5 } from '../../types/i18n/reference'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'

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

  if (isOrderDataDictionarySameOrAbove('DDV5', order)) {
    if ('civilCountyCourts' in content.reference && notifyingOrganisation === 'CIVIL_COUNTY_COURT') {
      return [
        createAnswer(
          questions.civilCountyCourt.text,
          lookup(content.reference.civilCountyCourts, order.interestedParties?.notifyingOrganisationName),
          uri,
          answerOpts,
        ),
      ]
    }

    if ('familyCourts' in content.reference && notifyingOrganisation === 'FAMILY_COURT') {
      return [
        createAnswer(
          questions.familyCourt.text,
          lookup(content.reference.familyCourts, order.interestedParties?.notifyingOrganisationName),
          uri,
          answerOpts,
        ),
      ]
    }

    if ('militaryCourts' in content.reference && notifyingOrganisation === 'MILITARY_COURT') {
      return [
        createAnswer(
          questions.militaryCourt.text,
          lookup(content.reference.militaryCourts, order.interestedParties?.notifyingOrganisationName),
          uri,
          answerOpts,
        ),
      ]
    }

    if ('youthCourts' in content.reference && notifyingOrganisation === 'YOUTH_COURT') {
      return [
        createAnswer(
          questions.youthCourt.text,
          lookup(content.reference.youthCourts, order.interestedParties?.notifyingOrganisationName),
          uri,
          answerOpts,
        ),
      ]
    }
    if ('youthCustodyServiceRegions' in content.reference && notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE') {
      return [
        createAnswer(
          questions.youthCustodyServiceRegion.text,
          lookup(content.reference.youthCustodyServiceRegions, order.interestedParties?.notifyingOrganisationName),
          uri,
          answerOpts,
        ),
      ]
    }
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

  if (responsibleOrganisation === 'POLICE') {
    return [
      createAnswer(
        questions.police.text,
        lookup(content.reference.policeAreas, order.interestedParties?.responsibleOrganisationRegion),
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

const createProbationDeliveryUnitAnswer = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT.replace(':orderId', order.id)

  const { questions } = content.pages.probationDeliveryUnit
  const result = []
  if (order.dataDictionaryVersion !== 'DDV4' && order.interestedParties?.responsibleOrganisation === 'PROBATION') {
    result.push(
      createAnswer(
        questions.unit.text,
        lookup((<ReferenceCatalogDDv5>content.reference).probationDeliveryUnits, order.probationDeliveryUnit?.unit),
        uri,
        answerOpts,
      ),
    )
  }
  return result
}

const createViewModel = (order: Order, content: I18n) => {
  const answerOpts = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }
  return {
    contactDetails: createContactDetailsAnswers(order, content, answerOpts),
    addresses: createAddressAnswers(order, content, answerOpts),
    interestedParties: createInterestedPartiesAnswers(order, content, answerOpts),
    probationDeliveryUnit: createProbationDeliveryUnitAnswer(order, content, answerOpts),
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default createViewModel
