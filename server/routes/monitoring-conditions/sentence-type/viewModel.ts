import { MonitoringConditions } from '../model'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

export type SentenceTypeModel = ViewModel<Pick<MonitoringConditions, 'sentenceType'>> & {
  sentenceTypeQuestions: { question: string; value: string }[]
}

const getQuestions = (orderType: MonitoringConditions['orderType']) => {
  switch (orderType) {
    case 'POST_RELEASE':
      return [
        {
          question: 'Standard Determinate Sentence',
          value: 'Standard Determinate Sentence',
        },
        {
          question: 'Detention and Training Order',
          value: 'Detention and Training Order (DTO)',
        },
        {
          question: 'Section 250 / Section 91',
          value: 'Section 250 / Section 91',
        },
      ]
    case 'COMMUNITY':
      return [
        { question: 'Supervision Default Order', value: 'Community SDO' },
        { question: 'Suspended Sentence', value: 'Community Suspended Sentence' },
        { question: 'Youth Rehabilitation Order (YRO)', value: 'Community YRO' },
        { question: 'They have not been given one of these sentences', value: 'Community not in list' },
      ]
    default:
      return []
  }
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult): SentenceTypeModel => {
  const model: SentenceTypeModel = {
    sentenceType: { value: data.sentenceType || '' },
    sentenceTypeQuestions: getQuestions(data.orderType),
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.sentenceType!.error = getError(errors, 'sentenceType')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
