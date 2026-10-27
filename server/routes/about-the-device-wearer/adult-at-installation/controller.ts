import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class AdultAtInstallationController {
  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', { pageName: 'Responsible adult' })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    res.redirect(paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', req.params.orderId as string))
  }
}
