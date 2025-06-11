import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewAdditionalDetailsFormComponent from '../../components/forms/monitoring-conditions/curfewAdditionalDetailsFormComponent'

export default class CurfewAdditionalDetailsPage extends AppFormPage {
  public form = new CurfewAdditionalDetailsFormComponent()

  constructor() {
    super('Curfew', paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS, 'Electronic monitoring required')
  }

  fillInForm = (): void => {}
}
