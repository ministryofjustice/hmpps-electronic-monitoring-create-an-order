Cypress.Commands.add(
  'getByLabel',
  {
    prevSubject: 'element',
  },
  (
    subject,
    label: string | RegExp,
    options: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> = {},
  ): Cypress.Chainable<JQuery> => {
    const log = true

    return cy
      .wrap(subject, { log })
      .contains('label', label, { log })
      .invoke({ log }, 'attr', 'for')
      .then(id => cy.get(`#${id}`, { log, ...options }))
      .first({ log })
  },
)

Cypress.Commands.add(
  'getByLegend',
  {
    prevSubject: 'element',
  },
  (
    subject,
    legend: string | RegExp,
    options: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> = {},
  ): Cypress.Chainable<JQuery> => {
    const log = false

    return cy
      .wrap(subject, { log })
      .contains('legend', legend, { log })
      .parent('fieldset', { log, ...options })
  },
)
