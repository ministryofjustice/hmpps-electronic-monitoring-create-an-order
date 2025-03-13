import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import NoFixedAbodeFormComponent from '../../components/forms/contact-information/noFixedAbodeForm'

export default class NoFixedAbodePage extends AppFormPage {
  public form = new NoFixedAbodeFormComponent()

  constructor() {
    super('Fixed address', paths.CONTACT_INFORMATION.NO_FIXED_ABODE, 'Contact information')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
