import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import I18n from '../../../types/i18n'
import { ReferenceCatalogDDv6 } from '../../../types/i18n/reference'
import { AnswerOptions, createAnswer } from '../../../utils/checkYourAnswers'
import isOrderDataDictionarySameOrAbove from '../../../utils/dataDictionaryVersionComparer'
import { formatDateTime, lookup } from '../../../utils/utils'

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
  const resOfficerUri = paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id)
  const resOrgUri = paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id)

  const responsibleOfficerQuestions = content.pages.responsibleOfficer.questions
  const responsibleOrganisationQuestions = content.pages.responsibleOrganisation.questions

  const answers = []

  // Responsible Officer and Org answers
  if (order.interestedParties?.responsibleOfficerFirstName) {
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
        )
      ],
    )
  }

  if (order.interestedParties?.responsibleOrganisation) {
    answers.push(
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
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default { construct }
