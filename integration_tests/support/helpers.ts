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
    const log = false

    return cy.wrap(subject, { log }).then($subject => {
      const matchingLabel = $subject
        .find('label')
        .toArray()
        .find(element => {
          const text = element.textContent?.trim() ?? ''

          if (label instanceof RegExp) {
            return new RegExp(label.source, label.flags).test(text)
          }

          return text.includes(label)
        })
      const inputId = matchingLabel?.getAttribute('for')

      if (!inputId) {
        throw new Error(`No input associated with label ${label.toString()}`)
      }

      return cy.get(`#${CSS.escape(inputId)}`, { log, ...options })
    })
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
      .then($legend => cy.wrap($legend, { log }).parent('fieldset', { log, ...options }))
  },
)
