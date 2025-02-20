import axe from 'axe-core'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

// Use a faster typing speed to avoid slowing down the tests
Cypress.Keyboard.defaults({
  keystrokeDelay: 1,
})

// ACCESSIBILITY TESTING

function terminalLog(violations: axe.Result[]) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${violations.length === 1 ? 'was' : 'were'} detected`,
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }))

  cy.task('table', violationData)
}

Cypress.Commands.add('isAccessible', () => {
  cy.injectAxe()
  cy.checkA11y(
    null,
    {
      runOnly: {
        type: 'tag',
        values: [
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa', // GDS service standard
          'section508',
          'TTv5',
          'EN-301-549',
        ],
      },
      rules: {
        'aria-allowed-attr': { enabled: false }, // https://accessibility.blog.gov.uk/2021/09/21/an-update-on-the-accessibility-of-conditionally-revealed-questions/
      },
    },
    terminalLog,
  )
})
