import AppFormPage from '../../../../pages/appFormPage'
import paths from '../../../../../server/constants/paths'
import IsRejectionFormComponent from './IsRejectionFormComponent'
import { PageElement } from '../../../../pages/page'

export default class IsRejectionPage extends AppFormPage {
  public form = new IsRejectionFormComponent()

  constructor() {
    super('', paths.ORDER.IS_REJECTION)
  }

  get yesRadioButton(): PageElement {
    return cy.get('input[value="yes"]')
  }

  get noRadioButton(): PageElement {
    return cy.get('input[value="no"]')
  }

  get continueButton(): PageElement {
    return cy.get('button[value="continue"]')
  }

  get cancelButton(): PageElement {
    return cy.get('button[value="back"]')
  }

  isRejection() {
    this.yesRadioButton.click()
    this.continueButton.click()
  }

  isNotRejection() {
    this.noRadioButton.click()
    this.continueButton.click()
  }
}
