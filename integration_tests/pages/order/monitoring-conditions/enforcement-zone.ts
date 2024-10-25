import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import EnforcementZoneFormComponent from '../../components/forms/monitoring-conditions/enforcementZoneFormComponent'

export default class EnforcementZonePage extends AppFormPage {
  public form = new EnforcementZoneFormComponent()

  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.ZONE, 'Exclusion and inclusion zones')
  }
}
