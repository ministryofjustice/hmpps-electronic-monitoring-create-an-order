import { Request, Response } from 'express'
import { isValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import RiskAtInstallationService from './riskAtInstallationService'
import { firstUnansweredPage, pageForErrors } from './riskAtInstallationPages'

const continueRiskAtInstallation = async (
  req: Request,
  res: Response,
  riskAtInstallationService: RiskAtInstallationService,
  taskListService: TaskListService,
  currentPath: string,
) => {
  const order = req.order!

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
