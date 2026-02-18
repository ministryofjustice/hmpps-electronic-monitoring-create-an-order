import IndexPage from '../../../pages'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'
import { createFakeInterestedParties } from '../../../mockApis/faker'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

context('Probation-Deliever-Units', () => {
  context('DDV6', () => {
    const populateNewOrder = (interestedParties, probationDeliveryUnit) => {
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

      const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
      probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
      probationDeliveryUnitPage.form.saveAndContinueButton.click()
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

    it('Should able to select Staffordshire North as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Staffordshire North' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Staffordshire North' },
      ])
    })

    it('Should able to select Staffordshire South as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Staffordshire South' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Staffordshire South' },
      ])
    })

    it('Should able to select Personality Disorder Prosper (West Mids)  as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Personality Disorder Prosper (West Mids)' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        {
          key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)",
          value: 'Personality Disorder Prosper (West Mids)',
        },
      ])
    })

    it('Should able to select Stockport and Tameside as PDU', () => {
      const interestedParties = createFakeInterestedParties(
        'Prison',
        'Probation',
        'Liverpool Prison',
        'Greater Manchester',
      )
      const probationDeliveryUnit = { unit: 'Stockport and Tameside' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        {
          key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)",
          value: 'Stockport and Tameside',
        },
      ])
    })

    it('Should able to select Salford and Trafford as PDU', () => {
      const interestedParties = createFakeInterestedParties(
        'Prison',
        'Probation',
        'Liverpool Prison',
        'Greater Manchester',
      )
      const probationDeliveryUnit = { unit: 'Salford and Trafford' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        'Check your answer',
      )
      contactInformationCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Salford and Trafford' },
      ])
    })
  })
})
