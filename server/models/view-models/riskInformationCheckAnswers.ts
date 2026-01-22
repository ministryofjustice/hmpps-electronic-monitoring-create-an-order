import { createAnswer, createDatePreview, createMultipleChoiceAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import I18n from '../../types/i18n'
import { formatDateTime, lookup } from '../../utils/utils'
import config from '../../config'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'
import paths from '../../constants/paths'
import FeatureFlags from '../../utils/featureFlags'

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
          paths.INSTALLATION_AND_RISK.OFFENCE_LIST,
        ),
      )
    } else if (order.interestedParties?.notifyingOrganisation === 'CIVIL_COUNTY_COURT') {
      answers.push(
        createMultipleChoiceAnswer(
          'Offences',
          order.offences.map(
            offence =>
              `${lookup(content.reference.offences, offence.offenceType)} on ${createDatePreview(offence.offenceDate)}`,
          ),
          paths.INSTALLATION_AND_RISK.OFFENCE_LIST,
        ),
      )
    } else {
      answers.push(
        createAnswer(
          questions.offence.text,
          lookup(content.reference.offences, order.offences[0].offenceType),
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

  const possibleRisks = order.installationAndRisk?.riskCategory?.filter(
    it => Object.keys(content.reference.possibleRisks).indexOf(it) !== -1,
  )

  answers.push(
    createMultipleChoiceAnswer(
      questions.possibleRisk.text,
      possibleRisks?.map(category => lookup(content.reference.possibleRisks, category)) ?? [],
      uri,
      answerOpts,
    ),
  )
  const riskCategories = order.installationAndRisk?.riskCategory?.filter(
    it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1,
  )
  answers.push(
    createMultipleChoiceAnswer(
      questions.riskCategory.text,
      riskCategories?.map(category => lookup(content.reference.riskCategories, category)) ?? [],
      uri,
      answerOpts,
    ),
  )

  answers.push(createAnswer(questions.riskDetails.text, order.installationAndRisk?.riskDetails, uri, answerOpts))

  if (config.mappa.enabled) {
    answers.push(
      createAnswer(
        questions.mappaLevel.text,
        lookup(content.reference.mappaLevel, order.installationAndRisk?.mappaLevel),
        uri,
        answerOpts,
      ),
      createAnswer(
        questions.mappaCaseType.text,
        lookup(content.reference.mappaCategory, order.installationAndRisk?.mappaCaseType),
        uri,
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
