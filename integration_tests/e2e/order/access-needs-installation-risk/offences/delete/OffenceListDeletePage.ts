import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import { PageElement } from '../../../../../pages/page'

export default class OffenceDeletePage extends AppFormPage {
  constructor() {
    super('Are you sure that you want to delete this', paths.INSTALLATION_AND_RISK.DELETE)
  }

  get fullTitle(): PageElement {
    return cy.get('h1', { log: false })
  }

  confirmDeleteButton = (): PageElement => cy.get('#confirm-remove-button')

  cancelButton = (): PageElement => cy.get('#cancel-button')

  containsHint(hint: string) {
    return cy.contains(hint)
  }
}
