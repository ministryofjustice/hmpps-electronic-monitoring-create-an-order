import paths from '../../constants/paths'
import { Order } from '../../models/Order'
import { getRiskInformationFlow, RiskInformationPage, riskInformationPages } from '../../services/riskInformationFlow'

type RiskInformationTaskState = 'REQUIRED' | 'NOT_REQUIRED'

export type RiskInformationTask = {
  section: 'RISK_INFORMATION'
  name: RiskInformationPage
  path: string
  state: RiskInformationTaskState
  completed: boolean
}

type RiskInformationTaskDefinition = (order: Order) => RiskInformationTask

const requiredTask =
  (name: RiskInformationPage, path: string, completed: (order: Order) => boolean): RiskInformationTaskDefinition =>
  order => ({
    section: 'RISK_INFORMATION',
    name,
    path,
    state: 'REQUIRED',
    completed: completed(order),
  })

const riskInformationTaskDefinitions: Record<RiskInformationPage, RiskInformationTaskDefinition> = {
  [riskInformationPages.offence]: requiredTask(
    riskInformationPages.offence,
    paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM,
    order => order.offences.length > 0,
  ),
  [riskInformationPages.offenceOtherInfo]: requiredTask(
    riskInformationPages.offenceOtherInfo,
    paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO,
    order => order.offenceAdditionalDetails !== null && order.offenceAdditionalDetails !== undefined,
  ),
  [riskInformationPages.dapo]: requiredTask(
    riskInformationPages.dapo,
    paths.INSTALLATION_AND_RISK.DAPO,
    order => order.dapoClauses.length > 0,
  ),
  [riskInformationPages.detailsOfInstallation]: requiredTask(
    riskInformationPages.detailsOfInstallation,
    paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION,
    order => order.detailsOfInstallation !== null && order.detailsOfInstallation !== undefined,
  ),
  [riskInformationPages.isMappa]: requiredTask(
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
  [riskInformationPages.checkAnswers]: requiredTask(
    riskInformationPages.checkAnswers,
    paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
    () => true,
  ),
}

export const getRiskInformationTasks = (order: Order): RiskInformationTask[] => {
  const flow = getRiskInformationFlow(order.interestedParties?.notifyingOrganisation)

  return flow.pages.map(page => riskInformationTaskDefinitions[page](order))
}
