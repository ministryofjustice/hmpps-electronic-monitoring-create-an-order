import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewReleaseDateFormComponent from '../../components/forms/monitoring-conditions/curfewReleaseDateFormComponent'

export default class CurfewReleaseDatePage extends AppFormPage {
  public form = new CurfewReleaseDateFormComponent()

  constructor() {
    super('Curfew on release day', paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, 'Electronic monitoring required')
  }

  fillInForm = (): void => {
    this.form.fillInWith({
      releaseDate: new Date('2024-03-27T00:00:00.000Z'),
      startTime: { hours: '18', minutes: '15' },
      endTime: { hours: '19', minutes: '30' },
      address: /Second address/,
    })
  }
}
