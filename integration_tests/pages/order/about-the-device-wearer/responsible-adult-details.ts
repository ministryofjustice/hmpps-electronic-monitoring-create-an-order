import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ResponsibleAdultFormComponent from '../../components/forms/about-the-device-wearer/responsibleAdultForm'

export default class ResponsibleAdultPage extends AppFormPage {
  form = new ResponsibleAdultFormComponent()

  constructor() {
    super('About the device wearer', paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, 'Responsible Adult')
  }
}
