import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import DeviceWearerDetailsFormComponent from '../../components/forms/about-the-device-wearer/deviceWearerDetailsForm'

export default class DeviceWearerDetailsPage extends AppFormPage {
  form = new DeviceWearerDetailsFormComponent()

  constructor() {
    super('Personal details', paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS, 'About the device wearer')
  }
}
