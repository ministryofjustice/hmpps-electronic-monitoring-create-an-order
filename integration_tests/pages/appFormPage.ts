import AppPage from './appPage'
import ErrorSummaryComponent from './components/errorSummaryComponent'
import FormComponent from './components/formComponent'

export default class AppFormPage extends AppPage {
  get errorSummary(): ErrorSummaryComponent {
    return new ErrorSummaryComponent()
  }

  form: FormComponent

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
