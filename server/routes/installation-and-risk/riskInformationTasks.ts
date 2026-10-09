import paths from '../../constants/paths'
import { Order } from '../../models/Order'
import { getRiskInformationFlow, RiskInformationPage, riskInformationPages } from '../../services/riskInformationFlow'
import isVariationType from '../../utils/isVariationType'

type RequiredOrNotTaskState = 'REQUIRED' | 'NOT_REQUIRED'

const OPTIONAL_VARIATION_ORGANISATIONS = [
  'HOME_OFFICE',
  'CIVIL_COUNTY_COURT',
  'CROWN_COURT',
  'FAMILY_COURT',
  'MAGISTRATES_COURT',
  'MILITARY_COURT',
  'SCOTTISH_COURT',
  'YOUTH_COURT',
]

export const hasOptionalVariationSections = (order: Order): RequiredOrNotTaskState => {
  if (
    isVariationType(order.type) &&
    OPTIONAL_VARIATION_ORGANISATIONS.includes(order.interestedParties?.notifyingOrganisation ?? '')
  ) {
    return 'NOT_REQUIRED'
  }
  return 'REQUIRED'
}

export type RiskInformationTask = {
  section: 'RISK_INFORMATION'
  name: RiskInformationPage
  path: string
  state: RequiredOrNotTaskState
  completed: boolean
}

type RiskInformationTaskDefinition = (order: Order) => RiskInformationTask

const task =
  (name: RiskInformationPage, path: string, completed: (order: Order) => boolean): RiskInformationTaskDefinition =>
  order => ({
    section: 'RISK_INFORMATION',
    name,
    path,
    state: hasOptionalVariationSections(order),
    completed: completed(order),
  })

const riskInformationTaskDefinitions: Record<RiskInformationPage, RiskInformationTaskDefinition> = {
  [riskInformationPages.offence]: task(
    riskInformationPages.offence,
    paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM,
    order => order.offences.length > 0,
  ),
  [riskInformationPages.offenceOtherInfo]: task(
    riskInformationPages.offenceOtherInfo,
    paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO,
    order => order.offenceAdditionalDetails !== null && order.offenceAdditionalDetails !== undefined,
  ),
  [riskInformationPages.dapo]: task(
    riskInformationPages.dapo,
    paths.INSTALLATION_AND_RISK.DAPO,
    order => order.dapoClauses.length > 0,
  ),
  [riskInformationPages.detailsOfInstallation]: task(
    riskInformationPages.detailsOfInstallation,
    paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION,
    order => order.detailsOfInstallation !== null && order.detailsOfInstallation !== undefined,
  ),
  [riskInformationPages.isMappa]: task(
    riskInformationPages.isMappa,
    paths.INSTALLATION_AND_RISK.IS_MAPPA,
    order => order.mappa?.isMappa !== null && order.mappa?.isMappa !== undefined,
  ),
  [riskInformationPages.mappa]: order => ({
    section: 'RISK_INFORMATION',
    name: riskInformationPages.mappa,
    path: paths.INSTALLATION_AND_RISK.MAPPA,
    state: order.mappa?.isMappa === 'YES' ? 'REQUIRED' : 'NOT_REQUIRED',
    completed: order.mappa?.level !== null && order.mappa?.level !== undefined && order.mappa?.category != null,
  }),
  [riskInformationPages.checkAnswers]: () => ({
    section: 'RISK_INFORMATION',
    name: riskInformationPages.checkAnswers,
    path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
    state: 'REQUIRED',
    completed: true,
  }),
}

export const getRiskInformationTasks = (order: Order): RiskInformationTask[] => {
  const flow = getRiskInformationFlow(order.interestedParties?.notifyingOrganisation)

  return flow.pages.map(page => riskInformationTaskDefinitions[page](order))
}
