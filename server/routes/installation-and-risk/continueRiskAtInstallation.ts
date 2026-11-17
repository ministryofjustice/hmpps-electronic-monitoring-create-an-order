import { Request, Response } from 'express'
import { isValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import RiskAtInstallationService from './riskAtInstallationService'
import { firstUnansweredPage, pageForErrors } from './riskAtInstallationPages'
import paths from '../../constants/paths'

const continueRiskAtInstallation = async (
  req: Request,
  res: Response,
  riskAtInstallationService: RiskAtInstallationService,
  taskListService: TaskListService,
  currentPath: string,
) => {
  const order = req.order!

  const REVIEW_PAGES = [
    paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR,
    paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS,
    paths.INSTALLATION_AND_RISK.OTHER_RISKS,
  ]

  const answers = await riskAtInstallationService.getRiskAtInstallation(order)

  if (answers.riskCheck === 'YES') {
    const reviewPages = REVIEW_PAGES.map(path => path.replace(':orderId', order.id))
    const nextReviewPage = reviewPages[reviewPages.indexOf(currentPath) + 1]
    if (nextReviewPage) {
      res.redirect(nextReviewPage)
      return
    }
  }

  const unansweredPage = firstUnansweredPage(await riskAtInstallationService.getRiskAtInstallation(order), order.id)
  if (unansweredPage) {
    res.redirect(unansweredPage)
    return
  }

  const result = await riskAtInstallationService.submit({ accessToken: res.locals.user.token, order })

  if (isValidationResult(result)) {
    const route = pageForErrors(result, order.id) ?? { path: currentPath, errors: result }
    req.flash('validationErrors', route.errors)
    res.redirect(route.path)
  } else {
    res.redirect(taskListService.getNextPage('DETAILS_OF_INSTALLATION', order))
  }
}

export default continueRiskAtInstallation
