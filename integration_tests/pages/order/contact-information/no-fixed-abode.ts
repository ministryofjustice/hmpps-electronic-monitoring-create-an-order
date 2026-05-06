import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import NoFixedAbodeFormComponent from '../../components/forms/contact-information/noFixedAbodeForm'

export default class NoFixedAbodePage extends AppFormPage {
  public form = new NoFixedAbodeFormComponent()

  constructor(section: string = 'Contact information') {
    super('Fixed address', paths.CONTACT_INFORMATION.NO_FIXED_ABODE, section)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
