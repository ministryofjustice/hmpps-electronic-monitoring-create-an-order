import { Request, RequestHandler, Response } from 'express'
import installationLocationViewModel from '../../models/view-models/installationLocation'
import InstallationLocationFormDataModel from '../../models/form-data/installationLocation'
import TaskListService from '../../services/taskListService'
import { isValidationResult } from '../../models/Validation'
import paths from '../../constants/paths'
import InstallationLocationService from '../../services/installationLocationService'

export default class InstallationLocationController {
  constructor(
    private readonly installationLocationService: InstallationLocationService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = installationLocationViewModel.construct(req.order!, formData[0] as never, errors as never)
    res.render('pages/order/monitoring-conditions/installation-location', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = InstallationLocationFormDataModel.parse(req.body)
    const result = await this.installationLocationService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: { location: formData.location },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION.replace(':orderId', orderId))
    } else if (action === 'continue') {
      const orderLocation = req.order!.installationLocation?.location
      const newLocation = result?.location

      let { installationAppointment } = req.order!
      let newAddressList = req.order!.addresses

      if (newLocation !== orderLocation) {
        installationAppointment = null
        newAddressList = newAddressList.filter(address => address.addressType !== 'INSTALLATION')
      }

      res.redirect(
        this.taskListService.getNextPage('INSTALLATION_LOCATION', {
          ...req.order!,
          installationLocation: result,
          installationAppointment,
          addresses: newAddressList,
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
