import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type PrarrModel = ViewModel<Pick<MonitoringConditions, 'prarr'>> & {
  items: Item[]
}

interface Option {
  text: string
  value: string
  conditional?: {
    html: string
  }
}

interface Divider {
  divider: string
}

type Item = Option | Divider

const constructModel = (data: MonitoringConditions, errors: ValidationResult): PrarrModel => {
  return {
    prarr: { value: data.prarr || '', error: getError(errors, 'prarr') },
    items: getItems(),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getItems = () => {
  return [
    {
      text: 'Yes',
      value: 'YES',
    },
    {
      text: 'No',
      value: 'NO',
    },
    {
      divider: 'or',
    },
    {
      text: 'Not able to provide this information',
      value: 'UNKNOWN',
    },
  ]
}

export default constructModel
