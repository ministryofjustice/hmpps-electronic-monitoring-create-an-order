import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ProbationDeliveryUnitFormComponent from '../../components/forms/contact-information/probataionDeliveryUnitForm'

export default class ProbationDeliveryUnitPage extends AppFormPage {
  public form = new ProbationDeliveryUnitFormComponent()

  constructor() {
    super(null, paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT, 'Contact information')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
