import IndexPage from '../../../pages'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import { createFakeInterestedParties } from '../../../mockApis/faker'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

context('Police areas', () => {
  context('DDV6', () => {
    const populateNewOrder = interestedParties => {
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()
      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.contactInformationTask.click()

      const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith({ contactNumber: '' })
      contactDetailsPage.form.saveAndContinueButton.click()

      const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.fillInWith({ hasFixedAddress: 'No' })
      noFixedAbode.form.saveAndContinueButton.click()

      const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      interestedPartiesPage.form.fillInWith(interestedParties)
      interestedPartiesPage.form.saveAndContinueButton.click()
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
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: 'Select the Police force area', value: 'National Crime Agency' },
      ])
    })

    it('Should be able to select City of Westminster Magistrates Court International Office as magistrates court', () => {
      const interestedParties = createFakeInterestedParties(
        'Magistrates Court',
        'Police',
        'City of Westminster Magistrates Court International Office',
        'National Crime Agency',
      )
      populateNewOrder(interestedParties)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: 'Select the name of the Court', value: 'City of Westminster Magistrates Court International Office' },
      ])
    })

    it('Should be able to select Liverpool Youth Court (Hatton Garden) as youth court', () => {
      const interestedParties = createFakeInterestedParties(
        'Youth Court',
        'Police',
        'Liverpool Youth Court (Hatton Garden)',
        'National Crime Agency',
      )
      populateNewOrder(interestedParties)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: 'Select the name of the Youth Court', value: 'Liverpool Youth Court (Hatton Garden)' },
      ])
    })

    it('Should be able to select Penrith as youth court', () => {
      const interestedParties = createFakeInterestedParties(
        'Youth Court',
        'Police',
        'Penrith Youth Court',
        'National Crime Agency',
      )
      populateNewOrder(interestedParties)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: 'Select the name of the Youth Court', value: 'Penrith Youth Court' },
      ])
    })
  })
})
