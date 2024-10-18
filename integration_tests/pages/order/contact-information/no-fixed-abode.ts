import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import NoFixedAbodeFormComponent from '../../components/forms/contact-information/noFixedAbodeForm'

export default class NoFixedAbodePage extends AppPage {
  public form = new NoFixedAbodeFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.NO_FIXED_ABODE)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }
}
