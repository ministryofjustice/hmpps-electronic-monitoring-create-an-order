import StartPage from '../pages/order/start'
import Page from '../pages/page'

context('Start', () => {
  context('Should render start page', () => {
    beforeEach(() => {
      cy.task('reset')
    })

    it('Should render the correct elements', () => {
      const page = Page.visit(StartPage)
      page.signInButton().should('exist')

      cy.contains('h2', 'Use this service to:').should('have.class', 'govuk-heading-s')
      page.useServiceList.hasItem('submit an EMO application form electronically to EMS replacing sending it by email')
      page.useServiceList.hasItem('view and download your submitted application forms')
      page.useServiceList.hasItem('submit a change to an EMO application form')

      cy.contains('h2', "If you don't have an account:").should('have.class', 'govuk-heading-s')
      cy.get('#no-account-list')
        .children()
        .should('have.length', 2)
        .then(li => {
          expect(li.eq(0)).to.contain(
            'view the timetable to see if your team uses this service to submit applications. Your team may not be using the online service yet',
          )
          cy.wrap(li.eq(0))
            .find('a')
            .should('have.text', 'view the timetable')
            .and(
              'have.attr',
              'href',
              'https://ministryofjustice.github.io/hmpps-electronic-monitoring-create-an-order-docs/training-and-onboarding.html#onboarding-timetable',
            )
            .and('have.attr', 'target', '_blank')
          expect(li.eq(1)).to.contain(
            'if your team is using this service, follow the instructions to get a new account',
          )
          cy.wrap(li.eq(1))
            .find('a')
            .should('have.text', 'follow the instructions to get a new account')
            .and(
              'have.attr',
              'href',
              'https://ministryofjustice.github.io/hmpps-electronic-monitoring-create-an-order-docs/getting-an-account.html#getting-an-account',
            )
            .and('have.attr', 'target', '_blank')
        })
    })
  })
})
