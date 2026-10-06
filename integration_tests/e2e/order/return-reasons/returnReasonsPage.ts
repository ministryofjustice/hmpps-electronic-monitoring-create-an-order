import paths from '../../../../server/constants/paths'
import Page, { PageElement } from '../../../pages/page'

export default class ReturnReasonsPage extends Page {
  constructor() {
    super('EMS gave these reasons for returning this form', paths.ORDER.RETURN_REASONS)
  }

  get sectionHeadings(): PageElement {
    return cy.get('[id^="return-reasons-section-heading-"]')
  }

  reasonList(sectionIndex: number): PageElement {
    return cy.get('ul[aria-label="Reasons for returning this form"]').eq(sectionIndex)
  }

  reasonDetails(sectionIndex: number): PageElement {
    return this.reasonList(sectionIndex).find('li')
  }

  get backToFormButton(): PageElement {
    return cy.contains('button', 'Back to form')
  }
}
