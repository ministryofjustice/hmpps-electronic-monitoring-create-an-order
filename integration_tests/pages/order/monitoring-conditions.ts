import AppFormPage from '../appFormPage'

import paths from '../../../server/constants/paths'

import MonitoringConditionsFormComponent from '../components/forms/monitoringConditionsFormComponent'

export default class MonitoringConditionsPage extends AppFormPage {
  public form = new MonitoringConditionsFormComponent()

  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.BASE_URL, 'When should the monitoring take place')
  }
}
