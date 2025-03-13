import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import TrailMonitoringFormComponent from '../../components/forms/monitoring-conditions/trailMonitoringFormComponent'

export default class TrailMonitoringPage extends AppFormPage {
  public form = new TrailMonitoringFormComponent()

  constructor() {
    super('Trail monitoring', paths.MONITORING_CONDITIONS.TRAIL, 'Electronic monitoring required')
  }
}
