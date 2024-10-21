import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import ResponsibleOfficerDetailsFormComponent from '../../components/forms/about-the-device-wearer/responsibleOfficerDetailsForm'

export default class ResponsibleOfficerDetilsPage extends AppPage {
  form = new ResponsibleOfficerDetailsFormComponent()

  constructor() {
    super(
      'About the device wearer',
      paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_OFFICER,
      'Responsible officer / responsible organisation details',
    )
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
