import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import { PageElement } from '../../../../../pages/page'
import OffenceListDeleteComponent from './OffenceListDeleteComponent'

export default class OffenceListDeletePage extends AppFormPage {
  public form = new OffenceListDeleteComponent()

  constructor() {
    super('Are you sure you want to delete this', paths.INSTALLATION_AND_RISK.DELETE)
  }

  confirmRemoveButton = (): PageElement => cy.get('#confirm-remove-button')

  cancelButton = (): PageElement => cy.get('#cancel-button')
}
