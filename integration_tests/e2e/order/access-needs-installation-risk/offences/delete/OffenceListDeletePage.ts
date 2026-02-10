import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import { PageElement } from '../../../../../pages/page'
import OffenceDeleteComponent from './OffenceListDeleteComponent'

export default class OffenceDeletePage extends AppFormPage {
  public form = new OffenceDeleteComponent()

  constructor() {
    super('Are you sure that you want to delete this', paths.INSTALLATION_AND_RISK.DELETE)
  }

  get fullTitle(): PageElement {
    return cy.get('h1', { log: false })
  }

  confirmRemoveButton = (): PageElement => cy.get('#confirm-remove-button')

  cancelButton = (): PageElement => cy.get('#cancel-button')
}
