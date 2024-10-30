import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import TrailMonitoringFormComponent from '../../components/forms/monitoring-conditions/trailMonitoringFormComponent'

export default class TrailMonitoringPage extends AppFormPage {
  public form = new TrailMonitoringFormComponent()

  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.TRAIL, 'Trail monitoring')
  }
}
