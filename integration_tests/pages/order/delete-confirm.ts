import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class DeleteConfirmPage extends AppPage {
  constructor() {
    super(' Are you sure you want to delete this form?', paths.ORDER.DELETE)
  }

  confirmDeleteButton = (): PageElement => cy.get('#confirm-delete-button')

  backButton = (): PageElement => cy.get('#back-button')
}
