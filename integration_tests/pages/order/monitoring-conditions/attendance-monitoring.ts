import paths from '../../../../server/constants/paths'
import AppFormPage from '../../appFormPage'
import AttendanceMonitoringFormComponent from '../../components/forms/monitoring-conditions/attendanceMonitoringFormComponent'

export default class AttendanceMonitoringPage extends AppFormPage {
  public form = new AttendanceMonitoringFormComponent()

  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.ATTENDANCE, 'Attendance monitoring')
  }
}
