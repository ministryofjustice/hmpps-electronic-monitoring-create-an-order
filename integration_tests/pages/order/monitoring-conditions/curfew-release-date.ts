import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewReleaseDateFormComponent from '../../components/forms/monitoring-conditions/curfewReleaseDateFormComponent'

export default class CurfewReleaseDatePage extends AppFormPage {
  public form = new CurfewReleaseDateFormComponent()

  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, 'Curfew for day of release')
  }

  fillInForm = (): void => {
    this.form.fillInWith({
      releaseDate: new Date('2024-03-27T00:00:00.000Z'),
      startTime: '18:15:00',
      endTime: '19:30:00',
      address: 'Secondary address',
    })
  }
}
