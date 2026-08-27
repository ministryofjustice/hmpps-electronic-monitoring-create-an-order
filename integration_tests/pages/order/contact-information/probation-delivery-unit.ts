import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import ProbationDeliveryUnitFormComponent from '../../components/forms/contact-information/probataionDeliveryUnitForm'

export default class ProbationDeliveryUnitPage extends AppFormPage {
  public form = new ProbationDeliveryUnitFormComponent()

  constructor(section: string = 'Contact information') {
    super(
      "What is the Responsible Organisation's Probation Delivery Unit (PDU)?",
      paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT,
      section,
    )
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
