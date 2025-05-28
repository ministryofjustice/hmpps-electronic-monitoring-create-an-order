import { NextFunction, Request, Response } from 'express'
import getContent from '../i18n'

const populateContent = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: replace dd version with feature flag
  res.locals.content = getContent('en', 'DDv4')
  next()
}

export default populateContent
