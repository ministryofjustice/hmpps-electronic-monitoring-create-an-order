import NotifyingOrganisationPage from '../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import IndexPage from '../../pages'
import Page from '../../pages/page'

export default function createNewOrder({ notifyingOrganisation, stubSignin = true }): void {
  if (stubSignin) {
    cy.signIn()
  }
  const indexPage = Page.verifyOnPage(IndexPage)
  indexPage.newOrderFormButton.click()
  const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
  notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
  notifyingOrganisationPage.form.continueButton.click()
}
