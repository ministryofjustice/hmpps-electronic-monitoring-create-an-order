import { NextFunction, Request, Response } from 'express'
import getContent from '../i18n'
import { DataDictionaryVersions } from '../types/i18n/dataDictionaryVersion'
import { Locales } from '../types/i18n/locale'
import FeatureFlags from '../utils/featureFlags'

const populateContent = async (req: Request, res: Response, next: NextFunction) => {
  const ddv5Enabled = FeatureFlags.getInstance().get('DD_V5_1_ENABLED')
  const ddVersion = ddv5Enabled ? DataDictionaryVersions.DDv5 : DataDictionaryVersions.DDv4
  res.locals.content = getContent(Locales.en, ddVersion)
  next()
}

export default populateContent
