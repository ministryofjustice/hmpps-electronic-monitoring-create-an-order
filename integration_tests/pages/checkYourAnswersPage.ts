import AppPage from './appPage'
import { PageElement } from './page'

export default class CheckYourAnswersPage extends AppPage {
  continueButton = (): PageElement => cy.contains('Save and go to next section')

  returnButton = (): PageElement => cy.contains('Save as draft')
}
