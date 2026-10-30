import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import DisabilitiesFormComponent from '../../components/forms/about-the-device-wearer/disabilitiesForm'

export default class DisabilitiesPage extends AppFormPage {
  form = new DisabilitiesFormComponent()

  constructor() {
    super('Disability and health conditions', paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES, 'About the device wearer')
  }
}
