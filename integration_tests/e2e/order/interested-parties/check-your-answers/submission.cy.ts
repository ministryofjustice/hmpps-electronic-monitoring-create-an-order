import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import InterestedPartiesCheckYourAnswersPage from './interestedPartiesCheckYourAnswersPage'
import OrderTasksPage from '../../../../pages/order/summary'
import IdentityNumbersPage from '../../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()
context('interested parties check answers page', () => {
  const testFlags = { INTERESTED_PARTIES_FLOW_ENABLED: true }
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('setFeatureFlags', testFlags)

    cy.signIn()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  context('in progress order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        orderType: 'REQUEST',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: 'officer',
            responsibleOfficerLastName: 'name',
            responsibleOfficerEmail: 'officer@email',

            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
          },
        },
      })
    })

    it('navigates correctly to summary', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')

      page.returnButton().click()

      Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId }, {}, true)
    })

    it('navigates correctly to next section', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')

      page.continueButton().click()

      Page.verifyOnPage(IdentityNumbersPage, { orderId: mockOrderId })
    })
  })
  context('submitted order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: 'officer',
            responsibleOfficerLastName: 'name',
            responsibleOfficerEmail: 'officer@email',

            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
          },
        },
      })
    })

    it('submitted order has expected navigation button', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      page.returnButton().contains('Return to the main form menu')
      page.returnButton().click()
      Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId }, {}, true)
    })
  })

  context('variation in progress', () => {
    const mockVersionId = uuidv4()
    beforeEach(() => {
      cy.task('stubCemoGetVersion', {
        httpStatus: 200,
        id: mockOrderId,
        versionId: mockVersionId,
        status: 'SUBMITTED',
        orderType: 'VARIATION',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: 'officer',
            responsibleOfficerLastName: 'name',
            responsibleOfficerEmail: 'officer@email',

            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
          },
        },
      })
    })

    it('submitted order has expected navigation button', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      page.returnButton().contains('Return to the main form menu')
      page.returnButton().click()
      Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId }, {}, true)
    })
  })
})
