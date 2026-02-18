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
  dapolMessage?: string
  licenceMessage?: string
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

const getDapolPilotProbationRegionStatus = (order: Order): boolean => {
  if (order.interestedParties?.responsibleOrganisation === 'PROBATION') {
    if (order.interestedParties?.responsibleOrganisationRegion) {
      const listOfProbationRegions = FeatureFlags.getInstance().getValue('DAPOL_PILOT_PROBATION_REGIONS').split(',')
      return listOfProbationRegions?.indexOf(order.interestedParties.responsibleOrganisationRegion) !== -1
    }
  }
  return false
}

const getDapolMessage = (order: Order): string => {
  const isDapolPilotProbationRegion = getDapolPilotProbationRegionStatus(order)
  if (order.interestedParties?.responsibleOrganisation === 'PROBATION') {
    if (isDapolPilotProbationRegion) {
      return ''
    }
    return `The device wearer is being managed by the ${probationRegions[order.interestedParties?.responsibleOrganisationRegion as keyof typeof probationRegions]} probation region. To be eligible for the DAPOL pilot they must be managed by an in-scope region. Any queries around pilot eligibility need to be raised with the appropriate COM.`
  }
  return ''
}

const getLicencePilotProbationRegionStatus = (order: Order): boolean => {
  if (
    order.interestedParties?.notifyingOrganisation === 'PROBATION' &&
    order.interestedParties?.responsibleOrganisation === 'PROBATION'
  ) {
    if (order.interestedParties?.responsibleOrganisationRegion) {
      const listOfProbationRegions = FeatureFlags.getInstance()
        .getValue('LICENCE_VARIATION_PROBATION_REGIONS')
        .split(',')
      return listOfProbationRegions?.indexOf(order.interestedParties.responsibleOrganisationRegion) !== -1
    }
  }
  return false
}

const getLicenceMessage = (order: Order): string => {
  const isLicencePilotProbationRegion = getLicencePilotProbationRegionStatus(order)
  if (
    order.interestedParties?.notifyingOrganisation === 'PROBATION' &&
    order.interestedParties?.responsibleOrganisation === 'PROBATION'
  ) {
    if (isLicencePilotProbationRegion) {
      return ''
    }
    return `The device wearer is being managed by the ${probationRegions[order.interestedParties?.responsibleOrganisationRegion as keyof typeof probationRegions]} probation region. To be eligible for the Licence Variation pilot they must be managed by an in-scope region.`
  }
  return ''
}

const constructModel = (order: Order, data: MonitoringConditions, errors: ValidationResult): PilotModel => {
  const isDapolPilotProbationRegion = getDapolPilotProbationRegionStatus(order)
  const isLicenceProbationRegion = getLicencePilotProbationRegionStatus(order)
  const model: PilotModel = {
    pilot: {
      value: data.pilot || '',
    },
    items: getItems(
      isDapolPilotProbationRegion,
      isLicenceProbationRegion,
      data.hdc,
      order.interestedParties?.notifyingOrganisation,
    ),
    errorSummary: null,
    dapolMessage: getDapolMessage(order),
    licenceMessage: getLicenceMessage(order),
  }
  if (errors && errors.length > 0) {
    model.pilot!.error = getError(errors, 'pilot')
    model.errorSummary = createGovukErrorSummary(errors)
  }
  return model
}

const getItems = (
  isDapolPilotProbationRegion: boolean,
  isLicencePilotProbationRegion: boolean,
  hdc?: string | null,
  notifyingOrganisation?: string | null,
): Item[] => {
  let items: Item[]
  if (hdc === 'NO') {
    items = [
      {
        text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
        value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
        disabled: !isDapolPilotProbationRegion,
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
        disabled: !isDapolPilotProbationRegion,
      },
      { text: 'GPS acquisitive crime (EMAC)', value: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW' },
      { divider: 'or' },
      {
        text: 'They are not part of any of these pilots',
        value: 'UNKNOWN',
      },
    ]
  }

  if (notifyingOrganisation === 'PROBATION') {
    items.splice(2, 0, {
      text: 'Licence Variation Project',
      value: 'LICENCE_VARIATION_PROJECT',
      conditional: {
        html: 'The pilot is only for probation practitioners varying a licence in response to an escalation of risk or as an alternative to recall.',
      },
      disabled: !isLicencePilotProbationRegion,
    })
  }

  return items
}

export default constructModel
