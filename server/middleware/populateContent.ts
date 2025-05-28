import { NextFunction, Request, Response } from 'express'
import getContent from '../i18n'
import { DataDictionaryVersions } from '../types/i18n/dataDictionaryVersion'
import { Locales } from '../types/i18n/locale'

const populateContent = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: replace dd version with feature flag
  res.locals.content = getContent(Locales.en, DataDictionaryVersions.DDv4)
  next()
}

export default populateContent
