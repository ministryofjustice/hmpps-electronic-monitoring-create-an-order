import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type PoliceAreaViewModel = ViewModel<Pick<MonitoringConditions, 'policeArea'>> & {
  items: (Option | Divider)[]
}

interface Option {
  text: string
  value: string
}

interface Divider {
  divider: string
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
  const divider = { divider: 'or' }

  const mappedPoliceAreas = entries.map(policeArea => {
    return { text: policeArea[1].toString(), value: policeArea[1].toString() }
  })

  return [...mappedPoliceAreas.slice(0, -1), divider, ...mappedPoliceAreas.slice(-1)]
}

export default constructModel
