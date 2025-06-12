import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import InstallationLocationFormComponent from '../../components/forms/monitoring-conditions/installationLocationFormComponent'

export default class InstallationLocationPage extends AppFormPage {
  public form = new InstallationLocationFormComponent()

  constructor() {
    super(
      'Installation appointment',
      paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT,
      'Electronic monitoring required',
    )
  }
}
