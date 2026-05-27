import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeInterestedParties } from '../../../mockApis/faker'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'

context('Police areas', () => {
  context('DDV6', () => {
    const populateNewOrder = interestedParties => {
      createNewOrder({
        notifyingOrganisation: interestedParties,
      })

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.interestedPartiesTask.click()

      fillInInterestedPartiesWith({
        responsibleOfficer: interestedParties.responsibleOfficer,
        responsibleOrganisation: {
          responsibleOrganisation: interestedParties.responsibleOrganisation,
          policeArea: interestedParties.responsibleOrganisationRegion,
        },
        continueOnCya: false,
      })
    }

    beforeEach(() => {
      cy.task('resetDB')
      cy.task('reset')

      cy.task('stubSignIn', {
        name: 'Cemor Stubs',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
      })
      cy.signIn()
    })

    it('Should able to select National Crime Agency as police area', () => {
      const interestedParties = createFakeInterestedParties(
        'Prison',
        'Police',
        'Liverpool Prison',
        'National Crime Agency',
      )
      populateNewOrder(interestedParties)
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: 'Select the Police force area', value: 'National Crime Agency' },
      ])
    })
  })
})
