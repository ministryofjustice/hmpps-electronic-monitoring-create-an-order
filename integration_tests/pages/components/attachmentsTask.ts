import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class AttachmentTask {
  private elementCacheId: string = uuidv4()

  constructor(private readonly name: string) {
    cy.get('.govuk-summary-list__row')
      .contains('.govuk-summary-list__key', this.name)
      .parent()
      .as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get actions(): PageElement {
    return this.element.find('.govuk-summary-list__actions')
  }

  get status(): PageElement {
    return this.element.find('.govuk-summary-list__value')
  }

  get addAction(): PageElement {
    return this.actions.contains('.govuk-link', 'Add')
  }

  get changeAction(): PageElement {
    return this.actions.contains('.govuk-link', 'Change')
  }

  get deleteAction(): PageElement {
    return this.actions.contains('.govuk-link', 'Delete')
  }

  get downloadAction(): PageElement {
    return this.status.find('a')
  }
}
