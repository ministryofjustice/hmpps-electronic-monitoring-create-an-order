import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export type PilotModel = ViewModel<Pick<MonitoringConditions, 'pilot'>> & {
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

const constructModel = (data: MonitoringConditions, errors: ValidationResult): PilotModel => {
  const model: PilotModel = {
    pilot: {
      value: data.pilot || '',
    },
    items: getItems(data.hdc),
    errorSummary: null,
  }
  if (errors && errors.length > 0) {
    model.pilot!.error = getError(errors, 'pilot')
    model.errorSummary = createGovukErrorSummary(errors)
  }
  return model
}

const getItems = (hdc?: string | null): Item[] => {
  let items: Item[]
  if (hdc === 'NO') {
    items = [
      { text: 'Domestic Abuse Perpetrator on Licence (DAPOL)', value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL' },
      { text: 'GPS acquisitive crime', value: 'GPS_ACQUISITIVE_CRIME_PAROLE' },
      { divider: 'or' },
      {
        text: 'They are not part of any of these pilots',
        value: 'UNKNOWN',
        conditional: {
          html: 'To be eligible for tagging the device wearer must either be part of a pilot or have Alcohol Monitoring on Licence (AML) as a licence condition.',
        },
      },
    ]
  } else {
    items = [
      {
        text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
        value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC',
      },
      { text: 'GPS acquisitive crime', value: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW' },
      { divider: 'or' },
      {
        text: 'They are not part of any of these pilots',
        value: 'UNKNOWN',
      },
    ]
  }
  return items
}

export default constructModel
