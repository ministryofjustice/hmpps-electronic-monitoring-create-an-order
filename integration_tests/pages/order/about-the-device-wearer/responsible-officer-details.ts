import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import ResponsibleOfficerFormComponent from '../../components/forms/about-the-device-wearer/responsibleOfficerForm'

export default class ResponsibleOfficerPage extends AppPage {
  form = new ResponsibleOfficerFormComponent()

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  constructor() {
    super(
      'About the device wearer',
      paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_OFFICER,
      'Responsible officer / responsible organisation details',
    )
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
