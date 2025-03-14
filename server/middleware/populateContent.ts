import { NextFunction, Request, Response } from 'express'
import i18n from '../i18n'

const populateContent = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.content = i18n.en
  next()
}

export default populateContent
