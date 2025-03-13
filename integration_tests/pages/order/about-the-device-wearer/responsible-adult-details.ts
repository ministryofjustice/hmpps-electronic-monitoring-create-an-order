import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ResponsibleAdultFormComponent from '../../components/forms/about-the-device-wearer/responsibleAdultForm'

export default class ResponsibleAdultPage extends AppFormPage {
  form = new ResponsibleAdultFormComponent()

  constructor() {
    super('Responsible adult details', paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, 'About the device wearer')
  }
}
