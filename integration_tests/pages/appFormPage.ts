import AppPage from './appPage'
import ErrorSummaryComponent from './components/errorSummaryComponent'
import FormComponent from './components/formComponent'

export default class AppFormPage extends AppPage {
  get errorSummary(): ErrorSummaryComponent {
    return new ErrorSummaryComponent()
  }

  form: FormComponent

  checkOnPage(): void {
    cy.get('h1', { log: false }).contains(this.title)

    if (this.subtitle) {
      cy.get('h1 span', { log: false }).contains(this.subtitle)
    }

    if (this.form) {
      this.form.checkHasForm()
    }
  }
}
