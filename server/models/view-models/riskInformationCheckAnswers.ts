import { createAnswer, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { formatDateTime, lookup } from '../../utils/utils'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'
import paths from '../../constants/paths'
import FeatureFlags from '../../utils/featureFlags'
import { getRiskInformationFlow } from '../../services/riskInformationFlow'

const createViewModel = (order: Order, content: I18n, goToNextSectionNavigation: boolean, uri: string = '') => {
  const { questions } = content.pages.installationAndRisk

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR' || !order.isOwner }
  const offenceAnswers = []
  const riskAnswers = []

  const isHomeOfficeUser = order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE'
  const riskInformationFlow = getRiskInformationFlow(order.interestedParties?.notifyingOrganisation)

  const isNewOffenceFlow =
    isOrderDataDictionarySameOrAbove('DDV6', order) && FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')

  const firstOffence = order.offences?.[0]
  const offencePath = firstOffence?.id
    ? paths.INSTALLATION_AND_RISK.OFFENCE.replace(':orderId', order.id).replace(':offenceId', firstOffence.id)
    : paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM.replace(':orderId', order.id)

  if (isNewOffenceFlow) {
    if (riskInformationFlow.offence.mode === 'USER_ENTERED') {
      answers.push(
        createMultipleChoiceAnswer(
          questions.offence.text,
          order.offences.map(offence => lookup(content.reference.offences, offence.offenceType)),
          offencePath,
          answerOpts,
        ),
      )
      offenceAnswers.push(
        createAnswer(
          'Any other information to be aware of about the offence committed?',
          order.offenceAdditionalDetails?.additionalDetails || '',
          paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id),
          answerOpts,
        ),
      )
    }
  } else {
    offenceAnswers.push(
      createAnswer(
        questions.offence.text,
        lookup(content.reference.offences, order.installationAndRisk?.offence),
        uri,
        answerOpts,
      ),
    )
  }

  if (!isNewOffenceFlow && isOrderDataDictionarySameOrAbove('DDV5', order)) {
    offenceAnswers.push(
      createAnswer(
        questions.offenceAdditionalDetails.text,
        order.installationAndRisk?.offenceAdditionalDetails,
        uri,
        answerOpts,
      ),
    )
  }

  let riskCategoriesFromOrder
  let genderRiskDetailsFromOrder
  let riskDetailsFromOrder
  let riskDetailsUri
  if (isOrderDataDictionarySameOrAbove('DDV6', order) && FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')) {
    riskCategoriesFromOrder = order.detailsOfInstallation?.riskCategory || []
    genderRiskDetailsFromOrder = order.detailsOfInstallation?.genderRiskDetails
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

  riskAnswers.push(
    createMultipleChoiceAnswer(
      questions.possibleRisk.text,
      possibleRisks?.map(category => lookup(content.reference.possibleRisks, category)) ?? [],
      riskDetailsUri,
      answerOpts,
    ),
  )

  if (possibleRisks.includes('RISK_TO_GENDER') && genderRiskDetailsFromOrder) {
    riskAnswers.push(
      createAnswer(questions.genderRiskDetails.text, genderRiskDetailsFromOrder, riskDetailsUri, answerOpts),
    )
  }

  const riskCategories = riskCategoriesFromOrder.filter(
    it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1,
  )
  riskAnswers.push(
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      riskCategories?.map(category => lookup(content.reference.riskCategories, category)) ?? [],
      riskDetailsUri,
      answerOpts,
    ),
  )

  riskAnswers.push(createAnswer(questions.riskDetails.text, riskDetailsFromOrder, riskDetailsUri, answerOpts))

  if (isHomeOfficeUser) {
    const isMappaQuestions = content.pages.isMappa.questions
    const mappaQuestions = content.pages.mappa.questions
    riskAnswers.push(
      createAnswer(
        isMappaQuestions.isMappa.text,
        lookup(content.reference.isMappa, order.mappa?.isMappa),
        paths.INSTALLATION_AND_RISK.IS_MAPPA.replace(':orderId', order.id),
        answerOpts,
      ),
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

  const answers = isNewOffenceFlow ? [...riskAnswers, ...offenceAnswers] : [...offenceAnswers, ...riskAnswers]

  return {
    riskInformation: answers,
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    goToNextSectionNavigation,
  }
}

export default createViewModel
