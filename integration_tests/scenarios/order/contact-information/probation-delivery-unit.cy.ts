import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeInterestedParties } from '../../../mockApis/faker'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'

context('Probation-Deliever-Units', () => {
  context('DDV6', () => {
    const populateNewOrder = (interestedParties, probationDeliveryUnit) => {
      createNewOrder({
        notifyingOrganisation: interestedParties,
      })

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.interestedPartiesTask.click()

      fillInInterestedPartiesWith({
        responsibleOfficer: interestedParties.responsibleOfficer,
        responsibleOrganisation: {
          responsibleOrganisation: interestedParties.responsibleOrganisation,
          probationRegion: interestedParties.responsibleOrganisationRegion,
        },
        pdu: probationDeliveryUnit.unit,
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

    it('Should able to select Staffordshire North as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Staffordshire North' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Staffordshire North' },
      ])
    })

    it('Should able to select Staffordshire South as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Staffordshire South' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Staffordshire South' },
      ])
    })

    it('Should able to select Personality Disorder Prosper (West Mids)  as PDU', () => {
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'West Midlands')
      const probationDeliveryUnit = { unit: 'Personality Disorder Prosper (West Mids)' }
      populateNewOrder(interestedParties, probationDeliveryUnit)
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
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
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
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
      const interestedPartiesCheckYourAnswersPage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        'Check your answer',
      )
      interestedPartiesCheckYourAnswersPage.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Salford and Trafford' },
      ])
    })
  })
})
