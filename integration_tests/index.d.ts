declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    /**
     * Custom command to check accessibility of a page against W3C AA standard.
     * @example cy.isAccessible()
     */
    isAccessible(): Chainable<AUTWindow>

    /**
     * Custom command to get a form field by label text. Options are passed to the command to get the actual field element
     * @example cy.getByLabel('My text field')
     */
    getByLabel: (
      label: string | RegExp,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>,
    ) => Chainable<JQuery>

    /**
     * Custom command to get a form fieldset by legend text. Options are passed to the command to get the actual fieldset element
     * @example cy.getByLegend('Important fields')
     */
    getByLegend: (
      legend: string | RegExp,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>,
    ) => Chainable<JQuery>
  }
}
