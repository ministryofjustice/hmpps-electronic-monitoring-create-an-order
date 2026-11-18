import { StatusUpdate } from '../../models/StatusUpdate'

export type ReturnReasonsSection = {
  heading: string
  details: string[]
}

export type ReturnReasonsViewModel = {
  pageTitle: string
  sections: ReturnReasonsSection[]
  orderSummaryUri: string
}

const construct = (statusUpdates: StatusUpdate[], orderSummaryUri: string): ReturnReasonsViewModel => {
  const sections = new Map<string, string[]>()

  for (const statusUpdate of statusUpdates) {
    if (statusUpdate.status === 'REJECTED') {
      for (const reason of statusUpdate.reasons) {
        if (reason.details) {
          const details = sections.get(reason.section) ?? []
          details.push(reason.details)
          sections.set(reason.section, details)
        }
      }
    }
  }

  return {
    pageTitle: 'EMS gave these reasons for returning this form',
    sections: [...sections.entries()].map(([heading, details]) => ({ heading, details })),
    orderSummaryUri,
  }
}

export default { construct }
