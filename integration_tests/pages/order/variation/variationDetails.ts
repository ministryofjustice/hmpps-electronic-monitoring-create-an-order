import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import VariationDetailsFormComponent from '../../components/forms/variation/variationDetails'

export default class VariationDetailsPage extends AppFormPage {
  public form = new VariationDetailsFormComponent()

  constructor() {
    super('Details of the changes', paths.VARIATION.VARIATION_DETAILS, 'About the changes in this version of the form')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
