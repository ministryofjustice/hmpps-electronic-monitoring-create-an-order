Cypress.Commands.add(
  'getByLabel',
  {
    prevSubject: 'element',
  },
  (
    subject,
    label: string,
    options: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> = {},
  ): Cypress.Chainable<JQuery> => {
    return cy
      .wrap(subject, { log: false })
      .contains('label', label)
      .invoke({ log: false }, 'attr', 'for')
      .then(id => cy.get(`#${id}`, { log: false, ...options }))
  },
)

Cypress.Commands.add(
  'getByLegend',
  {
    prevSubject: 'element',
  },
  (
    subject,
    legend: string,
    options: Partial<Cypress.Loggable & Cypress.Timeoutable> = {},
  ): Cypress.Chainable<JQuery> => {
    return cy
      .wrap(subject, { log: false })
      .contains('legend', legend)
      .parent('fieldset', { log: false, ...options })
  },
)
