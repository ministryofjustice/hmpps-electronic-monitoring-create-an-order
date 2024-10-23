import AppPage from '../../appPage'
import { PageElement } from '../../page'

import ResponsibleOfficerFormComponent from '../../components/forms/about-the-device-wearer/responsibleOfficerForm'

export default class ResponsibleOfficerPage extends AppPage {
  form = new ResponsibleOfficerFormComponent()

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  constructor() {
    super('About the device wearer', '', 'Responsible officer / responsible organisation details')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
