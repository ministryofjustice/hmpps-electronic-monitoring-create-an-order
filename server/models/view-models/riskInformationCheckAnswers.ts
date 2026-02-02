import { createAnswer, createDatePreview, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { formatDateTime, lookup } from '../../utils/utils'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'
import paths from '../../constants/paths'
import FeatureFlags from '../../utils/featureFlags'
import { notifyingOrganisationCourts } from '../NotifyingOrganisation'

const createViewModel = (order: Order, content: I18n, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR' }
  const answers = []
  if (isOrderDataDictionarySameOrAbove('DDV6', order) && FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')) {
    if (order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT') {
      answers.push(
        createMultipleChoiceAnswer(
          'DAPO order clauses',
          order.dapoClauses.map(clause => `${clause.clause} on ${createDatePreview(clause.date)}`),
          paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id),
        ),
      )
    } else if (
      notifyingOrganisationCourts.find(court => court === order.interestedParties?.notifyingOrganisation) !== undefined
    ) {
      answers.push(
        createMultipleChoiceAnswer(
          'Offences',
          order.offences.map(
            offence =>
              `${lookup(content.reference.offences, offence.offenceType)} on ${createDatePreview(offence.offenceDate)}`,
          ),
          paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id),
        ),
      )
    } else {
      answers.push(
        createAnswer(
          questions.offence.text,
          lookup(content.reference.offences, order.offences[0]?.offenceType),
          uri,
          answerOpts,
        ),
      )
    }
  } else {
    answers.push(
      createAnswer(
        questions.offence.text,
        lookup(content.reference.offences, order.installationAndRisk?.offence),
        uri,
        answerOpts,
      ),
    )
  }

  if (isOrderDataDictionarySameOrAbove('DDV5', order)) {
    answers.push(
      createAnswer(
        questions.offenceAdditionalDetails.text,
        order.installationAndRisk?.offenceAdditionalDetails,
        uri,
        answerOpts,
      ),
    )
  }

  let riskCategoriesFromOrder
  let riskDetailsFromOrder
  let riskDetailsUri
  if (isOrderDataDictionarySameOrAbove('DDV6', order) && FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')) {
    riskCategoriesFromOrder = order.detailsOfInstallation?.riskCategory || []
    riskDetailsFromOrder = order.detailsOfInstallation?.riskDetails
    riskDetailsUri = paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION.replace(':orderId', order.id)
  } else {
    riskCategoriesFromOrder = order.installationAndRisk?.riskCategory || []
    riskDetailsFromOrder = order.installationAndRisk?.riskDetails
    riskDetailsUri = uri
  }

  const possibleRisks = riskCategoriesFromOrder.filter(
    it => Object.keys(content.reference.possibleRisks).indexOf(it) !== -1,
  )

  answers.push(
    createMultipleChoiceAnswer(
      questions.possibleRisk.text,
      possibleRisks?.map(category => lookup(content.reference.possibleRisks, category)) ?? [],
      riskDetailsUri,
      answerOpts,
    ),
  )
  const riskCategories = riskCategoriesFromOrder.filter(
    it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1,
  )
  answers.push(
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      riskCategories?.map(category => lookup(content.reference.riskCategories, category)) ?? [],
      riskDetailsUri,
      answerOpts,
    ),
  )

  answers.push(createAnswer(questions.riskDetails.text, riskDetailsFromOrder, riskDetailsUri, answerOpts))

  if (order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE') {
    const mappaQuestions = content.pages.mappa.questions
    answers.push(
      createAnswer(
        mappaQuestions.mappaLevel.text,
        lookup(content.reference.mappaLevel, order.mappa?.level),
        paths.INSTALLATION_AND_RISK.MAPPA.replace(':orderId', order.id),
        answerOpts,
      ),
      createAnswer(
        mappaQuestions.mappaCategory.text,
        lookup(content.reference.mappaCategory, order.mappa?.category),
        paths.INSTALLATION_AND_RISK.MAPPA.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }
  return {
    riskInformation: answers,
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default createViewModel
