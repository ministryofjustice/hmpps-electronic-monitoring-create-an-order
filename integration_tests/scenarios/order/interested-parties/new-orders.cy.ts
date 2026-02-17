import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import NotifyingOrganisationPage from '../../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import ResponsibleOfficerPage from '../../../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../../../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import ProbationDeliveryUnitPage from '../../../e2e/order/interested-parties/probation-delivery-unit/probationDeliveryUnitPage'

context('Interested parties flow', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { INTERESTED_PARTIES_FLOW_ENABLED: true }

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()
  })

  // it('Notifying organisation is court', () => {})

  // it('Notifying organisation is Home Office', () => {})

  it('Notifying organisation is prison and resonsible organisation is probation', () => {
    const input = {
      notifyingOrganisation: 'Prison',
      responsibleOrganisation: 'Probation',
    }
    const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    notifyingOrganisationPage.form.fillInWith(input.notifyingOrganisation)
    notifyingOrganisationPage.form.continueButton.click()

    const responsibleOfficerPage = Page.verifyOnPage(ResponsibleOfficerPage)
    responsibleOfficerPage.form.continueButton.click()

    const responsibleOrganisationPage = Page.verifyOnPage(ResponsibleOrganisationPage)
    responsibleOrganisationPage.form.fillInWith(input.responsibleOrganisation)
    responsibleOrganisationPage.form.continueButton.click()

    const pduPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    pduPage.form.continueButton.click()

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    //TODO veriry check your answers
  })

  // it('Notifying organisation is probation', () => {})
})
