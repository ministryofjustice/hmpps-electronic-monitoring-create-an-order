import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import AboutDeviceWearerFormComponent from '../../components/forms/about-the-device-wearer/deviceWearerForm'

export default class AboutDeviceWearerPage extends AppPage {
  form = new AboutDeviceWearerFormComponent()

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  constructor() {
    super('About the device wearer', paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, '')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
