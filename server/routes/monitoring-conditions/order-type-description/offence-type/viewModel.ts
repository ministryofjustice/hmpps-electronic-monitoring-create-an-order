import { ValidationResult } from '../../../../models/Validation'
import { ViewModel } from '../../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../../utils/errors'
import { getError } from '../../../../utils/utils'
import { MonitoringConditions } from '../model'

export type OffenceTypeViewModel = ViewModel<Pick<MonitoringConditions, 'offenceType'>> & {
  items: Option[]
}

interface Option {
  text: string
  value: string
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult): OffenceTypeViewModel => {
  return {
    offenceType: { value: data.offenceType || '', error: getError(errors, 'offenceType') },
    items: getItems(),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getItems = () => {
  return [
    {
      value: 'Burglary in a Dwelling - Indictable only',
      text: 'Burglary in a Dwelling - Indictable only',
    },
    {
      value: 'Burglary in a Dwelling - Triable either way',
      text: 'Burglary in a Dwelling - Triable either way',
    },
    {
      value: 'Aggravated Burglary in a Dwelling',
      text: 'Aggravated Burglary in a Dwelling',
    },
    {
      value: 'Burglary in a Building other than a Dwelling - Indictable only',
      text: 'Burglary in a Building other than a Dwelling - Indictable only',
    },
    {
      value: 'Burglary in a Building other than a Dwelling - Triable either way',
      text: 'Burglary in a Building other than a Dwelling - Triable either way',
    },
    {
      value: 'Aggravated Burglary in a Building not a Dwelling',
      text: 'Aggravated Burglary in a Building not a Dwelling',
    },
    {
      value: 'Theft from the Person of Another',
      text: 'Theft from the Person of Another',
    },
    {
      value: 'Theft from a Vehicle',
      text: 'Theft from a Vehicle',
    },
    {
      value: 'Theft from a Motor Vehicle (excl. aggravated vehicle taking) - Triable either way (MOT)',
      text: 'Theft from a Motor Vehicle (excl. aggravated vehicle taking) - Triable either way (MOT)',
    },
    {
      value: 'Robbery',
      text: 'Robbery',
    },
  ]
}

export default constructModel
