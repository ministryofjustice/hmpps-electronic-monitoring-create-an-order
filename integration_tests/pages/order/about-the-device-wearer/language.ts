import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import LanguageFormComponent from '../../components/forms/about-the-device-wearer/languageForm'

export default class LanguagePage extends AppFormPage {
  form = new LanguageFormComponent()

  constructor() {
    super('Is an interpreter needed?', paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE, 'About the device wearer')
  }
}
