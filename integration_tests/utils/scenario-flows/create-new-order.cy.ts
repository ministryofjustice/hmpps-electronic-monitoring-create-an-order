import NotifyingOrganisationPage from '../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import SentencingActPage from '../../e2e/order/interested-parties/sentencing-act/sentencingActPage'
import IndexPage from '../../pages'
import Page from '../../pages/page'

export default function createNewOrder({ notifyingOrganisation, stubSignin = true, sentencingActAnswer = 'No' }): void {
  if (stubSignin) {
    cy.signIn()
  }
  const indexPage = Page.verifyOnPage(IndexPage)
  indexPage.newOrderFormButton.click()
  const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
  notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
  notifyingOrganisationPage.form.continueButton.click()

  const sentencingActPage = Page.verifyOnPage(SentencingActPage)
  sentencingActPage.form.fillInWith(sentencingActAnswer)
  sentencingActPage.continueButton.click()
}
