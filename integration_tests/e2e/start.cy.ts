import StartPage from '../pages/order/start'
import Page from '../pages/page'

context('Start', () => {
  context('Should render start page', () => {
    beforeEach(() => {
      cy.task('reset')
    })

    it('Should render the correct elements', () => {
      const page = Page.visit(StartPage)

      page.informationBanner().should('exist')
      page.signInButton().should('exist')
    })

    it('Information banner link should have the correct href', () => {
      const page = Page.visit(StartPage)
      page
        .informationBanner()
        .get(
          '.govuk-notification-banner__link[href="https://teams.microsoft.com/l/message/19:OnBcewjl8XVVbtZHzEubBtFzb4YrBiXPzVy_7636qqE1@thread.tacv2/1758015177552?tenantId=c6874728-71e6-41fe-a9e1-2e8c36776ad8&groupId=7b704d24-6eac-4f53-a418-4e92b5ebd531&parentMessageId=1758015177552&teamName=Electronic%20Monitoring%20Order%20Support%20Channel&channelName=Electronic%20Monitoring%20Order%20Support%20&createdTime=1758015177552"]',
        )
        .should('exist')
    })
  })
})
