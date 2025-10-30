import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
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

const constructModel = (data: MonitoringConditions, errors: ValidationResult): PoliceAreaViewModel => {
  return {
    policeArea: { value: data.policeArea || '', error: getError(errors, 'policeArea') },
    items: getItems(),
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getItems = () => {
  return [
    { text: 'Avon and Somerset', value: 'Avon and Somerset' },
    { text: 'Bedfordshire', value: 'Bedfordshire' },
    { text: 'Cheshire', value: 'Cheshire' },
    { text: 'City of London', value: 'City of London' },
    { text: 'Cumbria', value: 'Cumbria' },
    { text: 'Derbyshire', value: 'Derbyshire' },
    { text: 'Durham', value: 'Durham' },
    { text: 'Essex', value: 'Essex' },
    { text: 'Gloucestershire', value: 'Gloucestershire' },
    { text: 'Gwent', value: 'Gwent' },
    { text: 'Hampshire', value: 'Hampshire' },
    { text: 'Hertfordshire', value: 'Hertfordshire' },
    { text: 'Humberside', value: 'Humberside' },
    { text: 'Kent', value: 'Kent' },
    { text: 'Metropolitan Police', value: 'Metropolitan Police' },
    { text: 'North Wales', value: 'North Wales' },
    { text: 'Nottinghamshire', value: 'Nottinghamshire' },
    { text: 'Sussex', value: 'Sussex' },
    { text: 'West Midlands', value: 'West Midlands' },
  ]
}

export default constructModel
