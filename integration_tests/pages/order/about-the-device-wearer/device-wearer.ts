import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import AboutDeviceWearerFormComponent from '../../components/forms/about-the-device-wearer/deviceWearerForm'

export default class AboutDeviceWearerPage extends AppFormPage {
  form = new AboutDeviceWearerFormComponent()

  constructor() {
    super('About the device wearer', paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, '')
  }
}
