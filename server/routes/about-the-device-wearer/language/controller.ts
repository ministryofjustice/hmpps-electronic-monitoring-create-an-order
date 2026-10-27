import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class LanguageController {
  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', { pageName: 'Language' })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    res.redirect(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', req.params.orderId as string))
  }
}
