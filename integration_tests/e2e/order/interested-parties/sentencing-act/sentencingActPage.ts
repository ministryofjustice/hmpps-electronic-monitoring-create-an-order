import AppFormPage from '../../../../pages/appFormPage'
import paths from '../../../../../server/constants/paths'
import { PageElement } from '../../../../pages/page'

export default class SentencingActPage extends AppFormPage {
  constructor() {
    super(
      'Is the device wearer being released on or after 2 September 2026?',
      paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION,
    )
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

  answer(value: 'yes' | 'no') {
    if (value === 'yes') {
      this.yesRadioButton.click()
    } else {
      this.noRadioButton.click()
    }
    this.continueButton.click()
  }
}
