import { Request, RequestHandler, Response } from 'express'
import installationAppointmenttViewModel from '../../models/view-models/installationAppointment'
import InstallationAppointmentService from '../../services/installationAppointmentService'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import InstallationAppointmentFormDataModel from '../../models/form-data/installationAppointment'
import { Order } from '../../models/Order'
import InstallationAppointmentPageContent from '../../types/i18n/pages/installationAppointment'
import { Question } from '../../types/i18n/pages/questionPage'

export default class InstallationAppointmentController {
  constructor(
    private readonly installationAppointmentService: InstallationAppointmentService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = installationAppointmenttViewModel.construct(
      req.order!.installationAppointment,
      formData[0] as never,
      this.getAppointmentTimeQuestion(req.order!, res.locals.content!.pages.installationAppointment),
      this.shouldShowAppointmentTimeDetails(req.order!),
      errors as never,
    )
    res.render('pages/order/monitoring-conditions/installation-appointment', viewModel)
  }

  shouldShowAppointmentTimeDetails = (order: Order): boolean => {
    const location = order.installationLocation?.location
    return location === 'PRIMARY' || location === 'INSTALLATION'
  }

  getAppointmentTimeQuestion = (order: Order, pageContent: InstallationAppointmentPageContent): Question => {
    if (
      order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE' &&
      this.shouldShowAppointmentTimeDetails(order)
    ) {
      return pageContent.questions.preferredAppointmentTime
    }
    return pageContent.questions.appointmentTime
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string
    const formData = InstallationAppointmentFormDataModel.parse(req.body)
    const result = await this.installationAppointmentService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
      appointmentTimeDetailsRequired: this.shouldShowAppointmentTimeDetails(req.order!),
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(
        this.taskListService.getNextPage('INSTALLATION_APPOINTMENT', {
          ...req.order!,
          installationAppointment: result,
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
