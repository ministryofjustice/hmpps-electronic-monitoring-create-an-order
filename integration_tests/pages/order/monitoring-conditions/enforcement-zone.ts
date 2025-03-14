import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import EnforcementZoneFormComponent from '../../components/forms/monitoring-conditions/enforcementZoneFormComponent'

export default class EnforcementZonePage extends AppFormPage {
  public form = new EnforcementZoneFormComponent()

  constructor() {
    super('Exclusion zone monitoring ', paths.MONITORING_CONDITIONS.ZONE, 'Electronic monitoring required')
  }
}
