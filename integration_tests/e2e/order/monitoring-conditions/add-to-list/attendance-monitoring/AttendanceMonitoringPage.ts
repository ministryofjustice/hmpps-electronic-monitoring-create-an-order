import AttendanceMonitoringAddToListFormComponent from './AttendanceMonitoringComponent'
import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'

export default class AttendanceMonitoringAddToListPage extends AppFormPage {
  public form = new AttendanceMonitoringAddToListFormComponent()

  constructor() {
    super(
      'Mandatory attendance monitoring',
      paths.MONITORING_CONDITIONS.ATTENDANCE_ADD_TO_LIST,
      'Electronic monitoring required',
    )
  }
}
