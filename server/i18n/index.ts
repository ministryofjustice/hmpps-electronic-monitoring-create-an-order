import I18n from '../types/i18n'
import DataDictionaryVersion from '../types/i18n/dataDictionaryVersion'
import Locale from '../types/i18n/locale'
import getEnglishContent from './en'

const getContent = (locale: Locale, ddVersion: DataDictionaryVersion): I18n => {
  if (locale === 'cy') {
    throw new Error('Welsh language not implemented')
  }
  return getEnglishContent(ddVersion)
}

export default getContent
