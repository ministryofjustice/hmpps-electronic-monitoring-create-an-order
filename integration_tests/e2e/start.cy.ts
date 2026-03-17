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
      page.noAccountList
        .hasItem(
          'view the timetable to see if your team uses this service to submit applications. Your team may not be using the online service yet',
        )
        .hasCorrectLinkListItem(
          'https://ministryofjustice.github.io/hmpps-electronic-monitoring-create-an-order-docs/training-and-onboarding.html#onboarding-timetable',
          0,
        )
      page.noAccountList
        .hasItem('if your team is using this service, follow the instructions to get a new account')
        .hasCorrectLinkListItem(
          'https://ministryofjustice.github.io/hmpps-electronic-monitoring-create-an-order-docs/getting-an-account.html#getting-an-account',
          1,
        )

      cy.contains('h2', 'This service does not yet allow you to:').should('have.class', 'govuk-heading-s')
      page.restrictionsList.hasItem(
        'request a visit for refits or equipment checks. For example, if the battery is not working or there is a medical reason for a refit',
      )
      page.restrictionsList.hasItem('notify EMS of a change to the responsible officer')
      page.restrictionsList.hasItem(
        'notify EMS of a change to the curfew hours or address for a device wearer serving a community sentence',
      )
      page.restrictionsList.hasItem(
        "submit a 'Special' EMO application for a Serious Organised Crime case, those convicted of Terrorist Offences, or assessed as Terrorist Connected and Terrorist Risk cases",
      )

      cy.get('details')
        .should('have.class', 'govuk-details')
        .find('summary')
        .should('have.class', 'govuk-details__summary')
        .find('span')
        .should('have.class', 'govuk-details__summary-text')
        .and('have.text', 'How do I notify EMS of things that are not in the service?')
      cy.get('div.govuk-details__text')
        .find('h2')
        .eq(0)
        .should('have.class', 'govuk-heading-s')
        .and('have.text', 'How do I request a visit for refits or equipment checks or change the Responsible Officer?')
      page.notificationDropdown.hasItem('Use the service request portal if you have access')
      page.notificationDropdown
        .hasItem('If you don’t have access mail EMSEnforcement@ems.co.uk.')
        .hasCorrectEmailLink('EMSEnforcement@ems.co.uk', 0)

      cy.get('div.govuk-details__text')
        .find('h2')
        .eq(1)
        .should('have.class', 'govuk-heading-s')
        .and(
          'have.text',
          'How do I notify EMS for a change in curfew hours or address for a device wearer serving a community sentence?',
        )
      page.notificationDropdown
        .hasItem("Complete the 'PCSC address change form' Word document and send it to LPAdmin@ems.co.uk.")
        .hasCorrectEmailLink('LPAdmin@ems.co.uk', 1)

      cy.contains('h2', "How do I send a 'Special' order for a high-risk device wearer?").should(
        'have.class',
        'govuk-heading-s',
      )
      page.notificationDropdown.hasItem('complete the EMS NSD CPPC SOC order form')
      page.notificationDropdown
        .hasItem('send the completed form by email to emCCSpecialCase@ems.co.uk')
        .hasCorrectEmailLink('emCCSpecialCase@ems.co.uk', 2)
    })
  })
})
