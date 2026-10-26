import { OrderCohort } from '../models/OrderCohort'

export type TaskListCohortDefinition = {
  responsibleParty: 'RESPONSIBLE_OFFICER' | 'RESPONSIBLE_ORGANISATION'
  attachment: 'LICENCE' | 'NONE'
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
    attachment: 'NONE',
  },
  FAMILY_COURT: {
    responsibleParty: 'RESPONSIBLE_ORGANISATION',
    attachment: 'NONE',
  },
}
