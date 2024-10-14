import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import ResponsibleAdultFormComponent from '../../components/forms/about-the-device-wearer/responsibleAdultForm'

export default class ResponsibleAdultPage extends AppPage {
  form = new ResponsibleAdultFormComponent()

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  constructor() {
    super('About the device wearer', paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, 'Responsible Adult')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
