import paths from '../../../../server/constants/paths'
import AppFormPage from '../../appFormPage'
import CurfewDayOfReleaseFormComponent from '../../components/forms/monitoring-conditions/curfewDayOfReleaseFormComponent'

export default class CurfewDayOfReleasePage extends AppFormPage {
  public form = new CurfewDayOfReleaseFormComponent()

  constructor() {
    super(null, paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE, 'Electronic monitoring required')
  }
}
