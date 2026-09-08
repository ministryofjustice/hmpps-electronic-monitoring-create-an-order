import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { getRiskInformationFlow, RiskInformationPage, riskInformationPages } from '../../services/riskInformationFlow'
import FeatureFlags from '../../utils/featureFlags'

type GuardedRiskInformationPage = 'OFFENCE' | 'OFFENCE_OTHER_INFO' | 'OFFENCE_LIST' | 'DAPO'

const requiredTasks: Record<GuardedRiskInformationPage, readonly RiskInformationPage[]> = {
  OFFENCE: [riskInformationPages.offence],
  OFFENCE_OTHER_INFO: [riskInformationPages.offenceOtherInfo],
  OFFENCE_LIST: [riskInformationPages.dapo],
  DAPO: [riskInformationPages.dapo],
}

const createRiskInformationPageGuard = (page: GuardedRiskInformationPage): RequestHandler => {
  return (req: Request, res: Response, next) => {
    if (!FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')) {
      next()
      return
    }

    const flow = getRiskInformationFlow(req.order!.interestedParties?.notifyingOrganisation)
    const canAccessPage = requiredTasks[page].some(task => flow.pages.includes(task))

    if (canAccessPage) {
      next()
      return
    }

    res.redirect(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION.replace(':orderId', req.order!.id))
  }
}

export default createRiskInformationPageGuard
