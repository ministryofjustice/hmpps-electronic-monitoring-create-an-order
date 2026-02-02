import { Request, RequestHandler, Response } from 'express'
import DetailsOfInstallationModel from './viewModel'
import DetailsOfInstallationFormModel from './formModel'
import { isValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'
import DetailsOfInstallationService from './service'
import TaskListService from '../../../services/taskListService'

export default class DetailsOfInstallationController {
  constructor(
    private readonly detailsOfInstallationService: DetailsOfInstallationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = DetailsOfInstallationModel.construct(order)

    res.render('pages/order/installation-and-risk/details-of-installation', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const formData = DetailsOfInstallationFormModel.parse(req.body)

    const updateResult = await this.detailsOfInstallationService.updateDetailsOfInstallation({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('DETAILS_OF_INSTALLATION', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
