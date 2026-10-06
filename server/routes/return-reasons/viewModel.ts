import { Order } from '../../models/Order'

export type ReturnReasonsSection = {
  heading: string
  details: string[]
}

export type ReturnReasonsViewModel = {
  pageTitle: string
  sections: ReturnReasonsSection[]
  orderSummaryUri: string
}

const construct = (order: Order, orderSummaryUri: string): ReturnReasonsViewModel => {
  const sections = new Map<string, string[]>()

  for (const statusUpdate of order.statusUpdates ?? []) {
    if (statusUpdate.status === 'REJECTED') {
      for (const reason of statusUpdate.statusUpdateReasons) {
        if (reason.details !== null) {
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
