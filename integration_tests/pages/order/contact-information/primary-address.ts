import AddressPage from '../../addressPage'
import { PageElement } from '../../page'

import PrimaryAddressFormComponent from '../../components/forms/contact-information/primaryAddressFormComponent'

import paths from '../../../../server/constants/paths'

export default class PrimaryAddressPage extends AddressPage {
  public form = new PrimaryAddressFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.ADDRESSES, 'Primary address')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
