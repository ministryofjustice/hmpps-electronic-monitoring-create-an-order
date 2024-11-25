import AppPage from '../appPage'
import { PageElement } from '../page'

import paths from '../../../server/constants/paths'
import Task from '../components/task'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Tag request form', paths.ORDER.SUMMARY, 'Form sections')
  }

  get deviceWearerTask(): Task {
    return new Task('Device wearer')
  }

  get responsibleAdultTask(): Task {
    return new Task('Responsible adult')
  }

  get contactDetailsTask(): Task {
    return new Task('Contact details')
  }

  get noFixedAbodeTask(): Task {
    return new Task('No fixed abode')
  }

  get primaryAddressTask(): Task {
    return new Task('Primary address')
  }

  get secondaryAddressTask(): Task {
    return new Task('Secondary address')
  }

  get tertiaryAddressTask(): Task {
    return new Task('Tertiary address')
  }

  get interestedPartiesTask(): Task {
    return new Task('Interested parties')
  }

  get installationAndRiskTask(): Task {
    return new Task('Installation and risk')
  }

  get monitoringConditionsTask(): Task {
    return new Task('Monitoring conditions')
  }

  get installationAddressTask(): Task {
    return new Task('Installation address')
  }

  get curfewReleaseDateTask(): Task {
    return new Task('Curfew release date')
  }

  get curfewConditionsTask(): Task {
    return new Task('Curfew conditions')
  }

  get curfewTimetableTask(): Task {
    return new Task('Curfew timetable')
  }

  get zoneTask(): Task {
    return new Task('Enforcement zone monitoring')
  }

  get trailTask(): Task {
    return new Task('Trail monitoring')
  }

  get attendanceTask(): Task {
    return new Task('Attendance monitoring')
  }

  get alcoholTask(): Task {
    return new Task('Alcohol monitoring')
  }

  get attachmentsTask(): Task {
    return new Task('Attachments')
  }

  get submitOrderButton(): PageElement {
    return cy.contains('button', 'Submit order')
  }

  get backToSearchButton(): PageElement {
    return cy.contains('a', 'Back')
  }
}
