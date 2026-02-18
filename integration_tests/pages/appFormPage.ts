import AppPage from './appPage'
import ErrorSummaryComponent from './components/errorSummaryComponent'
import FormComponent from './components/formComponent'
import { PageElement } from './page'

export default class AppFormPage extends AppPage {
  get errorSummary(): ErrorSummaryComponent {
    return new ErrorSummaryComponent()
  }

  form: FormComponent

  actionLinkByLabel(questionText: string, action: 'Change' | 'Delete'): PageElement {
    return cy.contains('.govuk-summary-list__row', questionText).find('a').contains(action)
  }

  checkOnPage(): void {
    if (this.title) {
      cy.get('h1, legend', { log: false }).contains(this.title)
    }

    if (this.subtitle) {
      cy.get('span', { log: false }).contains(this.subtitle)
    }

    if (this.form) {
      this.form.checkHasForm()
    }
  }
}
