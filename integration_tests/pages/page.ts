export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T, Args extends unknown[]>(constructor: new (...args: Args) => T, ...args: Args): T {
    return new constructor(...args)
  }

  constructor(
    private readonly title: string,
    private readonly subtitle?: string,
  ) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)

    if (this.subtitle) cy.get('legend').contains(this.subtitle)
  }

  checkIsAccessible(): void {
    cy.isAccessible()
  }
}
