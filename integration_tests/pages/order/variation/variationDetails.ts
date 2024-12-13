import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import VariationDetailsFormComponent from '../../components/forms/variation/variationDetails'

export default class VariationDetailsPage extends AppFormPage {
  public form = new VariationDetailsFormComponent()

  constructor() {
    super('Variation', paths.VARIATION.VARIATION_DETAILS)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
