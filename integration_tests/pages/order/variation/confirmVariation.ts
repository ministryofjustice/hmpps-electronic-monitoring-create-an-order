import AppPage from '../../appPage'

import ConfirmVariationFormComponent from '../../components/forms/variation/confirmVariation'
import { PageElement } from '../../page'

export default class ConfirmVariationPage extends AppPage {
  public form = new ConfirmVariationFormComponent()

  constructor() {
    super('Are you sure that you want to make changes to the EMO application form for')
  }

  checkOnPage(): void {
    super.checkOnPage()
  }

  confirmButton = (): PageElement => cy.get('#confirm-button')

  cancelButton = (): PageElement => cy.get('#cancel-button')
}
