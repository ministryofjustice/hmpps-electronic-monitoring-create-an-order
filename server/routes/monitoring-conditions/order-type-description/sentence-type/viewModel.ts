import { MonitoringConditions } from '../model'
import { ViewModel } from '../../../../models/view-models/utils'
import { ValidationResult } from '../../../../models/Validation'
import { createGovukErrorSummary } from '../../../../utils/errors'
import { getError } from '../../../../utils/utils'

type SentenceTypeQuestion = { question: string; value: string }

export type SentenceTypeModel = ViewModel<Pick<MonitoringConditions, 'sentenceType'>> & {
  sentenceTypeQuestions: SentenceTypeQuestion[]
  pageHeading: string
  orderType: MonitoringConditions['orderType']
}

export const getQuestions = (orderType: MonitoringConditions['orderType']): SentenceTypeQuestion[] => {
  switch (orderType) {
    case 'POST_RELEASE':
      return [
        { question: 'Standard Determinate Sentence', value: 'STANDARD_DETERMINATE_SENTENCE' },
        { question: 'Extended Determinate Sentence', value: 'EXTENDED_DETERMINATE_SENTENCE' },
        { question: 'Imprisonment for Public Protection (IPP)', value: 'IPP' },
        { question: 'Life Sentence', value: 'LIFE_SENTENCE' },
        {
          question: 'Section 236A Special Custodial Sentences for Offenders of Particular Concern (SOPC)',
          value: 'SOPC',
        },
        { question: 'Section 227/228 Extended Sentence for Public Protection (EPP)', value: 'EPP' },
        { question: 'Section 85 Extended Sentences', value: 'SECTION_85_EXTENDED_SENTENCES' },
        { question: 'Section 250 / Section 91', value: 'SECTION_91' },
        { question: 'Detention and Training Order (DTO)', value: 'DTO' },
      ]

    case 'COMMUNITY':
      return [
        { question: 'Supervision Default Order', value: 'COMMUNITY_SDO' },
        { question: 'Suspended Sentence', value: 'COMMUNITY_SUSPENDED_SENTENCE' },
        { question: 'Youth Rehabilitation Order (YRO)', value: 'COMMUNITY_YRO' },
        { question: 'The sentence they have been given is not in the list', value: 'COMMUNITY' },
      ]
    case 'BAIL':
      return [
        { question: 'Bail Supervision & Support', value: 'BAIL_SUPERVISION_SUPPORT' },
        { question: 'Bail Remand to Local Authority Accomodation (RLAA)', value: 'BAIL_RLAA' },
        { question: 'The type of bail they have been given is not in the list', value: 'BAIL' },
      ]
    default:
      return []
  }
}

const constructModel = (
  orderType: MonitoringConditions['orderType'],
  data: MonitoringConditions,
  errors: ValidationResult,
): SentenceTypeModel => {
  const pageHeading =
    orderType === 'BAIL'
      ? 'What type of bail has the device wearer been given?'
      : 'What type of sentence has the device wearer been given?'

  const model: SentenceTypeModel = {
    pageHeading,
    sentenceType: { value: data.sentenceType || '' },
    sentenceTypeQuestions: getQuestions(orderType),
    errorSummary: null,
    orderType,
  }

  if (errors && errors.length) {
    model.sentenceType!.error = getError(errors, 'sentenceType')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
