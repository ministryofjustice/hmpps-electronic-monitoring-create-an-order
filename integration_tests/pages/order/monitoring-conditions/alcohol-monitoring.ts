import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import AlcoholMonitoringFormComponent from '../../components/forms/monitoring-conditions/alcoholMonitoringFormComponent'

export default class AlcoholMonitoringPage extends AppFormPage {
  public form = new AlcoholMonitoringFormComponent()

  constructor() {
    super('Alcohol monitoring', paths.MONITORING_CONDITIONS.ALCOHOL, 'Electronic monitoring required')
  }

  fillInForm = (): void => {
    this.form.fillInWith({
      monitoringType: 'Alcohol abstinence',
      startDate: new Date('2024-03-27T00:00:00.000Z'),
      endDate: new Date('2025-04-28T00:00:00.000Z'),
    })
  }
}
