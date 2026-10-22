import paths from '../../constants/paths'
import { Order } from '../../models/Order'
import { getRiskInformationFlow, RiskInformationPage, riskInformationPages } from '../../services/riskInformationFlow'
import { hasOptionalVariationSectionIsHOCourt } from '../../utils/utils'

type RiskInformationTaskState = 'REQUIRED' | 'NOT_REQUIRED' | 'OPTIONAL'

export type RiskInformationTask = {
  section: 'RISK_INFORMATION'
  name: RiskInformationPage
  path: string
  state: RiskInformationTaskState
  completed: boolean
}

type RiskInformationTaskDefinition = (order: Order) => RiskInformationTask

const task =
  (name: RiskInformationPage, path: string, completed: (order: Order) => boolean): RiskInformationTaskDefinition =>
  order => ({
    section: 'RISK_INFORMATION',
    name,
    path,
    state: hasOptionalVariationSectionIsHOCourt(order) ? 'OPTIONAL' : 'REQUIRED',
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
  [riskInformationPages.detailsOfInstallation]: order =>
    task(
      riskInformationPages.detailsOfInstallation,
      paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR,
      it => it.detailsOfInstallation !== null && it.detailsOfInstallation !== undefined,
    )(order),
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
  [riskInformationPages.checkAnswers]: task(
    riskInformationPages.checkAnswers,
    paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
    () => true,
  ),
}

export const getRiskInformationTasks = (order: Order): RiskInformationTask[] => {
  const flow = getRiskInformationFlow(order.interestedParties?.notifyingOrganisation)

  return flow.pages.map(page => riskInformationTaskDefinitions[page](order))
}
