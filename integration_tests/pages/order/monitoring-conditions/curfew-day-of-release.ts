import AppFormPage from '../../appFormPage'
import CurfewDayOfReleaseFormComponent from '../../components/forms/monitoring-conditions/curfewDayOfReleaseFormComponent'

export default class CurfewDayOfReleasePage extends AppFormPage {
  public form = new CurfewDayOfReleaseFormComponent()

  constructor() {
    super(
      'Curfew on day of release',
      '/order/:orderId/monitoring-conditions/curfew/day-of-release',
      'Electronic monitoring required',
    )
  }
}
