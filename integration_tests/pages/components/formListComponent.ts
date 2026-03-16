import { PageElement } from '../page'

export default class FormListComponent {
  private pageElement: PageElement

  constructor(private readonly id: string) {
    this.pageElement = cy.get(id)
  }

  get element(): PageElement {
    return this.pageElement
  }

  hasItem(name: string) {
    this.pageElement.children().should('contain', name)
  }
}
