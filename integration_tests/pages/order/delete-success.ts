import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class DeleteSuccessPage extends AppPage {
  constructor() {
    super('Application form successfully deleted', paths.ORDER.DELETE)
  }

  backButton = (): PageElement => cy.get('#back-button')
}
