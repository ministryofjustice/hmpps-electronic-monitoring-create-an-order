import { PageElement } from '../page'

export default class FormListComponent {
  private pageElement: PageElement

  constructor(private readonly id: string) {
    this.pageElement = cy.get(id).should('exist')
  }

  hasItem(text: string) {
    this.pageElement.children().should('contain', text)
    return this
  }

  hasCorrectLinkListItem(expectedHref: string, index: number) {
    this.pageElement.eq(index).find('a').should('have.attr', 'href', expectedHref).and('have.attr', 'target', '_blank')
    return this
  }

  hasCorrectLink(expectedHref: string) {
    this.pageElement.should('have.attr', 'href', expectedHref).and('have.attr', 'target', '_blank')
  }

  hasCorrectEmailLink(expectedEmail: string, index: number) {
    this.pageElement.find('a').eq(index).should('have.attr', 'href', `mailto:${expectedEmail}`)
    return this
  }
}
