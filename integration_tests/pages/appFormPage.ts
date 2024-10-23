import AppPage from './appPage'

import FormComponent from './components/formComponent'

export default class AppFormPage extends AppPage {
  form: FormComponent

  checkOnPage(): void {
    super.checkOnPage()

    if (this.form) {
      this.form.checkHasForm()
    }
  }
}
