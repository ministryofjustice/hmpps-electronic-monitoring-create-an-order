import paths from '../../../../../server/constants/paths'
import SentencingActFormComponent from './sentencingActFormComponent'
import AppFormPage from '../../../../pages/appFormPage'
import { PageElement } from '../../../../pages/page'

export default class SentencingActPage extends AppFormPage {
  public form = new SentencingActFormComponent()

  constructor() {
    super(
      'Is the device wearer being released on or after 1 October 2026?',
      paths.INTEREST_PARTIES.SENTENCING_ACT_SELECTION,
    )
  }

  get continueButton(): PageElement {
    return cy.get('button[value="continue"]')
  }
}
