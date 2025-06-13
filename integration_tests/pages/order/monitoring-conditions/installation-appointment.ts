import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import InstallationAppointmentFormComponent from '../../components/forms/monitoring-conditions/installationAppointmentFormComponent'

export default class InstallationLocationPage extends AppFormPage {
  public form = new InstallationAppointmentFormComponent()

  constructor() {
    super(
      'Installation appointment',
      paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT,
      'Electronic monitoring required',
    )
  }
}
