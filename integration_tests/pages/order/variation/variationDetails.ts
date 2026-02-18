import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import VariationDetailsFormComponent from '../../components/forms/variation/variationDetails'

export default class VariationDetailsPage extends AppFormPage {
  public form = new VariationDetailsFormComponent()

  constructor(isOldVersion?: boolean) {
    let path: string
    if (isOldVersion) {
      path = paths.VARIATION.VARIATION_DETAILS_VERSION
    } else {
      path = paths.VARIATION.VARIATION_DETAILS
    }
    super('Details of the changes', path, 'About the changes in this version of the form')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
