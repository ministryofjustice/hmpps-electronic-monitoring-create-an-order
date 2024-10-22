import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class SubmitSuccessPage extends AppPage {
  constructor() {
    super('Application successfully submitted', paths.ORDER.SUBMIT_SUCCESS)
  }

  get backToYourApplications(): PageElement {
    return cy.contains('Back to your applications')
  }
}
