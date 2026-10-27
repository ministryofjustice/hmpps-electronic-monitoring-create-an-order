import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class DeviceWearerDetailsController {
  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', { pageName: 'Device wearer details' })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    res.redirect(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', req.params.orderId as string))
  }
}
