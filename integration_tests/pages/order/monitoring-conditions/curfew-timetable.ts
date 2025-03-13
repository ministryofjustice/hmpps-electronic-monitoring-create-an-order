import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewTimetableFormComponent from '../../components/forms/monitoring-conditions/curfewTimetableFormComponent'

export default class CurfewTimetablePage extends AppFormPage {
  public form = new CurfewTimetableFormComponent()

  constructor() {
    super('Curfew timetable', paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, 'Electronic monitoring details')
  }
}
