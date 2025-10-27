import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MonitoringConditions } from '../model'
import { Order } from '../../../models/Order'
import FeatureFlags from '../../../utils/featureFlags'
import probationRegions from '../../../i18n/en/reference/ddv5/probationRegions'

export type PilotModel = ViewModel<Pick<MonitoringConditions, 'pilot'>> & {
  items: Item[]
  message?: string
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

const getPilotProbationRegionStatus = (order: Order): boolean => {
  if (order.interestedParties?.responsibleOrganisation === 'PROBATION') {
    if (order.interestedParties?.responsibleOrganisationRegion) {
      const listOfProbationRegions = FeatureFlags.getInstance().getValue('DAPOL_PILOT_PROBATION_REGIONS').split(',')
      return listOfProbationRegions?.indexOf(order.interestedParties.responsibleOrganisationRegion) !== -1
    }
  }
  return false
}

const constructModel = (order: Order, data: MonitoringConditions, errors: ValidationResult): PilotModel => {
  const isPilotProbationRegion = getPilotProbationRegionStatus(order)
  const model: PilotModel = {
    pilot: {
      value: data.pilot || '',
    },
    items: getItems(isPilotProbationRegion, data.hdc),
    errorSummary: null,
    message: isPilotProbationRegion
      ? ''
      : `The device wearer is being managed by the ${probationRegions[order.interestedParties?.responsibleOrganisationRegion as keyof typeof probationRegions]} probation region. To be eligible for the DAPOL pilot they must be managed by an in-scope region.`,
  }
  if (errors && errors.length > 0) {
    model.pilot!.error = getError(errors, 'pilot')
    model.errorSummary = createGovukErrorSummary(errors)
  }
  return model
}

const getItems = (isPilotProbationRegion: boolean, hdc?: string | null): Item[] => {
  let items: Item[]
  if (hdc === 'NO') {
    items = [
      {
        text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
        value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
        disabled: !isPilotProbationRegion,
      },
      { text: 'GPS acquisitive crime (EMAC)', value: 'GPS_ACQUISITIVE_CRIME_PAROLE' },
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
        disabled: !isPilotProbationRegion,
      },
      { text: 'GPS acquisitive crime (EMAC)', value: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW' },
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
