import paths from '../../../../server/constants/paths'
import AppFormPage from '../../appFormPage'
import AttendanceMonitoringFormComponent from '../../components/forms/monitoring-conditions/attendanceMonitoringFormComponent'

export default class AttendanceMonitoringPage extends AppFormPage {
  public form = new AttendanceMonitoringFormComponent()

  constructor() {
    super('Mandatory attendance monitoring', paths.MONITORING_CONDITIONS.ATTENDANCE, 'Electronic monitoring required')
  }
}
