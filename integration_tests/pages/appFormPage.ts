import AppPage from './appPage'
import ErrorSummaryComponent from './components/errorSummaryComponent'
import FormComponent from './components/formComponent'

export default class AppFormPage extends AppPage {
  get errorSummary(): ErrorSummaryComponent {
    return new ErrorSummaryComponent()
  }

  form: FormComponent

  checkOnPage(): void {
    super.checkOnPage()

    if (this.form) {
      this.form.checkHasForm()
    }
  }
}
