import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import I18n from '../../../types/i18n'
import { AnswerOptions, createAnswer } from '../../../utils/checkYourAnswers'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'
import { lookup } from '../../../utils/utils'

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

  const answers = [
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
  ]

  if (order.interestedParties?.responsibleOfficerName) {
    answers.push(
      ...[
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
      ],
    )
  }

  if (order.interestedParties?.responsibleOrganisation) {
    answers.push(
      ...[
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
      ],
    )
  }

  return answers
}

const construct = (order: Order, content: I18n) => {
  const answerOpts = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }
  return {
    interestedParties: createInterestedPartiesAnswers(order, content, answerOpts),
  }
}

export default { construct }
