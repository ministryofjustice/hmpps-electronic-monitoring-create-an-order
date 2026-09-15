import { OrderCohort } from '../models/OrderCohort'

export type TaskListCohortDefinition = {
  responsibleParty: 'RESPONSIBLE_OFFICER' | 'RESPONSIBLE_ORGANISATION'
  attachment: 'LICENCE' | 'COURT_ORDER' | 'NONE'
}

export const taskListCohortDefinitions: Record<OrderCohort, TaskListCohortDefinition> = {
  STANDARD: {
    responsibleParty: 'RESPONSIBLE_OFFICER',
    attachment: 'LICENCE',
  },
  HOME_OFFICE: {
    responsibleParty: 'RESPONSIBLE_ORGANISATION',
    attachment: 'NONE',
  },
  COURT: {
    responsibleParty: 'RESPONSIBLE_ORGANISATION',
    attachment: 'COURT_ORDER',
  },
  FAMILY_COURT: {
    responsibleParty: 'RESPONSIBLE_ORGANISATION',
    attachment: 'COURT_ORDER',
  },
}
