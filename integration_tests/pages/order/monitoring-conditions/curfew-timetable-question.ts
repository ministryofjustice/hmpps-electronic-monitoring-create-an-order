import paths from '../../../../server/constants/paths'
import AppFormPage from '../../appFormPage'
import CurfewTimetableQuestionFormComponent from '../../components/forms/monitoring-conditions/curfewTimetableQuestionFormComponent'

export default class CurfewTimetableQuestionPage extends AppFormPage {
  public form = new CurfewTimetableQuestionFormComponent()

  constructor() {
    super(null, paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE_QUESTION, 'Electronic monitoring required')
  }
}
