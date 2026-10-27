import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import TaskListService from '../../../services/taskListService'
import continueDeviceWearer from '../continueDeviceWearer'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'

export default class DeviceWearerDetailsController {
  constructor(
    private readonly deviceWearerAnswersService: DeviceWearerAnswersService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', { pageName: 'Device wearer details' })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const currentPath = paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id)

    // TODO: parse and validate the form with a form model
    await this.deviceWearerAnswersService.saveDeviceWearerDetails(order, req.body)

    await continueDeviceWearer(req, res, this.deviceWearerAnswersService, this.taskListService, currentPath)
  }
}
