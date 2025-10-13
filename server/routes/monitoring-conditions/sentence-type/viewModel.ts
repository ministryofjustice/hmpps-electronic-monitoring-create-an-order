import { MonitoringConditions } from '../model'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

type SentenceTypeQuestion = { question: string; value: string }

export type SentenceTypeModel = ViewModel<Pick<MonitoringConditions, 'sentenceType'>> & {
  sentenceTypeQuestions: SentenceTypeQuestion[]
  pageTitle: string
  orderType: MonitoringConditions['orderType']
}

const getQuestions = (orderType: MonitoringConditions['orderType']): SentenceTypeQuestion[] => {
  switch (orderType) {
    case 'POST_RELEASE':
      return [
        {
          question: 'Standard Determinate Sentence',
          value: 'Standard Determinate Sentence',
        },
        {
          question: 'Extended Determinate Sentence',
          value: 'Extended Determinate Sentence',
        },
        {
          question: 'Imprisonment for Public Protection (IPP)',
          value: 'Imprisonment for Public Protection (IPP)',
        },
        {
          question: 'Life Sentence',
          value: 'Life Sentence',
        },
        {
          question: 'Section 236A Special Custodial Sentences for Offenders of Particular Concern (SOPC)',
          value: 'Section 236A Special Custodial Sentences for Offenders of Particular Concern (SOPC)',
        },
        {
          question: 'Section 227/228 Extended Sentence for Public Protection (EPP)',
          value: 'Section 227/228 Extended Sentence for Public Protection (EPP)',
        },
        {
          question: 'Section 85 Extended Sentences',
          value: 'Section 85 Extended Sentences',
        },
        {
          question: 'Section 250 / Section 91',
          value: 'Section 250 / Section 91',
        },
        {
          question: 'Detention and Training Order (DTO)',
          value: 'Detention and Training Order (DTO)',
        },
      ]

    case 'COMMUNITY':
      return [
        { question: 'Supervision Default Order', value: 'Community SDO' },
        { question: 'Suspended Sentence', value: 'Community Suspended Sentence' },
        { question: 'Youth Rehabilitation Order (YRO)', value: 'Community YRO' },
        { question: 'They have not been given one of these sentences', value: 'COMMUNITY' },
      ]
    case 'BAIL':
      return [
        { question: 'Bail Supervision & Support', value: 'Bail Supervision & Support' },
        { question: 'Bail Remand to Local Authority Accomodation (RLAA)', value: 'Bail RLAA' },
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
  const pageTitle =
    orderType === 'BAIL'
      ? 'What type of bail has the device wearer been given?'
      : 'What type of sentence has the device wearer been given?'

  const model: SentenceTypeModel = {
    pageTitle,
    sentenceType: { value: data.sentenceType || '' },
    sentenceTypeQuestions: [],
    errorSummary: null,
    orderType,
  }

  model.sentenceTypeQuestions = getQuestions(orderType)

  if (errors && errors.length) {
    model.sentenceType!.error = getError(errors, 'sentenceType')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
