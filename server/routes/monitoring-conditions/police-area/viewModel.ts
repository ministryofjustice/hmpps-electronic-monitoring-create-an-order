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
  const differentPoliceArea = {
    value: "The device wearer's release address is in a different police force area",
    text: "The device wearer's release address is in a different police force area",
  }
  const mappedPoliceAreas = entries.map(it => {
    return { text: it[1].toString(), value: it[1].toString() }
  })

  return [...mappedPoliceAreas, divider, differentPoliceArea]
}

export default constructModel
