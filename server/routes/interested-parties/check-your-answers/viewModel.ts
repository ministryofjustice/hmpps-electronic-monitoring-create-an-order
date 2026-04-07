import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import I18n from '../../../types/i18n'
import { ReferenceCatalogDDv6 } from '../../../types/i18n/reference'
import { AnswerOptions, createAnswer } from '../../../utils/checkYourAnswers'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'
import { formatDateTime, lookup } from '../../../utils/utils'

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

const createInterestedPartiesAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions, cohort?: string) => {
  const notifyingOrgUri = paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', order.id)
  const resOfficerUri = paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id)
  const resOrgUri = paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id)

  const notifyingOrgQuestions = content.pages.notifyingOrganisation.questions
  const responsibleOfficerQuestions = content.pages.responsibleOfficer.questions
  const responsibleOrganisationQuestions = content.pages.responsibleOrganisation.questions

  const answers = []

  const isHomeOffice = cohort === 'HOME_OFFICE'
  const isProbation = cohort === 'PROBATION'

  if (!isHomeOffice && !isProbation) {
    answers.push(
      createAnswer(
        notifyingOrgQuestions.notifyingOrganisation.text,
        lookup(content.reference.notifyingOrganisations, order.interestedParties?.notifyingOrganisation),
        notifyingOrgUri,
        answerOpts,
      ),
    )
  }

  answers.push(
    ...getNotifyingOrganisationNameAnswer(order, content, notifyingOrgUri, answerOpts),
    createAnswer(
      notifyingOrgQuestions.notifyingOrganisationEmail.text,
      order.interestedParties?.notifyingOrganisationEmail,
      notifyingOrgUri,
      answerOpts,
    ),
  )

  const startDate = order.monitoringConditions.startDate
    ? new Date(order.monitoringConditions.startDate)
    : new Date(1900, 0, 0)

  const isStartDateInPast = startDate < new Date()

  if (
    order.interestedParties?.responsibleOfficerFirstName &&
    !(isStartDateInPast && order.status === 'SUBMITTED') &&
    !isHomeOffice
  ) {
    answers.push(
      ...[
        createAnswer(
          responsibleOfficerQuestions.firstName.text,
          order.interestedParties?.responsibleOfficerFirstName,
          resOfficerUri,
          answerOpts,
        ),
        createAnswer(
          responsibleOfficerQuestions.lastName.text,
          order.interestedParties?.responsibleOfficerLastName,
          resOfficerUri,
          answerOpts,
        ),
        createAnswer(
          responsibleOfficerQuestions.email.text,
          order.interestedParties?.responsibleOfficerEmail,
          resOfficerUri,
          answerOpts,
        ),
      ],
    )
  }

  if (order.interestedParties?.responsibleOrganisation && !(isStartDateInPast && order.status === 'SUBMITTED')) {
    answers.push(
      ...[
        createAnswer(
          responsibleOrganisationQuestions.responsibleOrganisation.text,
          lookup(content.reference.responsibleOrganisations, order.interestedParties?.responsibleOrganisation),
          resOrgUri,
          answerOpts,
        ),
        ...getResponsibleOrganisationRegionAnswer(order, content, resOrgUri, answerOpts),
        createAnswer(
          responsibleOrganisationQuestions.responsibleOrganisationEmail.text,
          order.interestedParties?.responsibleOrganisationEmail,
          resOrgUri,
          answerOpts,
        ),
      ],
    )
  }

  return answers
}

const createProbationDeliveryUnitAnswer = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id)

  const { questions } = content.pages.probationDeliveryUnit
  const answers = []

  const startDate = order.monitoringConditions.startDate
    ? new Date(order.monitoringConditions.startDate)
    : new Date(1900, 0, 0)

  const isStartDateInPast = startDate < new Date()

  if (
    isOrderDataDictionarySameOrAbove('DDV5', order) &&
    order.interestedParties?.responsibleOrganisation === 'PROBATION' &&
    !(isStartDateInPast && order.status === 'SUBMITTED')
  ) {
    answers.push(
      createAnswer(
        questions.unit.text,
        lookup((<ReferenceCatalogDDv6>content.reference).probationDeliveryUnits, order.probationDeliveryUnit?.unit),
        uri,
        answerOpts,
      ),
    )
  }
  return answers
}

const construct = (order: Order, content: I18n, cohort?: string) => {
  const answerOpts = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }

  const interestedParties = createInterestedPartiesAnswers(order, content, answerOpts, cohort)
  const probationDeliveryUnit = createProbationDeliveryUnitAnswer(order, content, answerOpts)

  return {
    interestedParties,
    probationDeliveryUnit,
    containsResponsibleOrgDetails: interestedParties.some(
      item => item.key?.text === "What is the Responsible Officer's organisation?",
    ),
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default { construct }
