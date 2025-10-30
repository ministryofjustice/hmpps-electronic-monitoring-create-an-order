import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type PoliceAreaViewModel = ViewModel<Pick<MonitoringConditions, 'policeArea'>> & {
  items: Option[]
}

interface Option {
  text: string
  value: string
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult, content: I18n): PoliceAreaViewModel => {
  return {
    policeArea: { value: data.policeArea || '', error: getError(errors, 'policeArea') },
    items: getItems(content),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getItems = (content: I18n) => {
  const entries = Object.entries(content.reference.policeAreas)
  return entries.map(it => {
    return { text: it[1].toString(), value: it[1].toString() }
  })
}

export default constructModel
