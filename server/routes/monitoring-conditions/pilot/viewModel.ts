import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'
import { Order } from '../../../models/Order'

export type PilotModel = ViewModel<Pick<MonitoringConditions, 'pilot'>> & {
  items: Item[]
}

interface Option {
  text: string
  value: string
  conditional?: {
    html: string
  }
  disabled?: boolean
}

interface Divider {
  divider: string
}

type Item = Option | Divider

const isLicenceVariationEligible = (order: Order): boolean => {
  if (order.isSentencingAct === true) {
    return true
  }

  return order.interestedParties?.responsibleOrganisation === 'PROBATION'
}

const isEligibleForDapol = (order: Order): boolean => {
  if (order.isSentencingAct === true) {
    return true
  }

  return order.interestedParties?.responsibleOrganisation === 'PROBATION'
}

const constructModel = (order: Order, data: MonitoringConditions, errors: ValidationResult): PilotModel => {
  const isDapolEligible = isEligibleForDapol(order)
  const isLicenceEligible = isLicenceVariationEligible(order)
  const isSentencingAct = order?.isSentencingAct ?? false
  const model: PilotModel = {
    pilot: {
      value: data.pilot || '',
    },
    items: getItems(
      isDapolEligible,
      isLicenceEligible,
      data.hdc,
      order.interestedParties?.notifyingOrganisation,
      isSentencingAct,
    ),
    errorSummary: null,
  }
  if (errors && errors.length > 0) {
    model.pilot!.error = getError(errors, 'pilot')
    model.errorSummary = createGovukErrorSummary(errors)
  }
  return model
}

const getItems = (
  isDapolEligible: boolean,
  isLicenceEligible: boolean,
  hdc?: string | null,
  notifyingOrganisation?: string | null,
  isSentencingAct: boolean = false,
): Item[] => {
  let items: Item[]
  if (hdc === 'NO') {
    items = [
      {
        text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
        value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
        disabled: !isDapolEligible,
      },
      { text: 'GPS acquisitive crime (EMAC)', value: 'GPS_ACQUISITIVE_CRIME_PAROLE' },
      { divider: 'or' },
      {
        text: 'They are not part of any of these pathfinders or programmes',
        value: 'UNKNOWN',
        conditional: {
          html: isSentencingAct
            ? ''
            : 'To be eligible for tagging the device wearer must either be part of a pathfinder or programme or have Alcohol Monitoring on Licence (AML) as a licence condition.',
        },
      },
    ]
  } else {
    items = [
      {
        text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
        value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC',
        disabled: !isDapolEligible,
      },
      { text: 'GPS acquisitive crime (EMAC)', value: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW' },
      { divider: 'or' },
      {
        text: 'They are not part of any of these pathfinders or programmes',
        value: 'UNKNOWN',
      },
    ]
  }

  if (notifyingOrganisation === 'PROBATION' && !isSentencingAct) {
    items.splice(2, 0, {
      disabled: !isLicenceEligible,
      text: 'Licence Variation Project',
      value: 'LICENCE_VARIATION_PROJECT',
      conditional: {
        html: 'The pathfinder or programme is only for probation practitioners varying a licence in response to an escalation of risk or as an alternative to recall.',
      },
    })
  }

  return items
}

export default constructModel
