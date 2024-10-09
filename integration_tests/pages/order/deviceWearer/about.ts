import AppPage from '../../appPage'
import { PageElement } from '../../page'

import AboutDeviceWearerFormComponent from '../../components/deviceWearer/aboutForm'

export default class AboutDeviceWearerPage extends AppPage {
  form: AboutDeviceWearerFormComponent

  constructor() {
    super('About the device wearer')
    this.form = new AboutDeviceWearerFormComponent()
  }

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')
}
