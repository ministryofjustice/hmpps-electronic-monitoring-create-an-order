import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class DeleteFailedPage extends AppPage {
  constructor() {
    super('You cannot delete an application that has been submitted', paths.ORDER.DELETE)
  }

  backButton = (): PageElement => cy.get('#back-button')
}
