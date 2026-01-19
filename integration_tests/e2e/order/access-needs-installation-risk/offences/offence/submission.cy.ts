import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffencePage from './offencePage'
import OffenceListPage from '../offence-list/offenceListPage'
import OffenceOtherInfoPage from '../offence-other-info/offenceOtherInfoPage'

const apiPath = '/offence'
const mockOrderId = uuidv4()
const stubOrder = (notifyingOrganisation = 'CROWN_COURT') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      interestedParties: {
        notifyingOrganisation,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
        responsibleOrganisationAddress: {
          addressType: 'RESPONSIBLE_ORGANISATION',
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          postcode: '',
        },
        responsibleOrganisationEmail: '',
        responsibleOrganisationPhoneNumber: '',
        responsibleOrganisationRegion: '',
      },
    },
  })
}
context('Offence submissions', () => {
  context('Notifying organisation is court', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder()

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: {
          offenceType: 'THEFT_OFFENCES',
          offenceDate: '2020-01-01T00:00:00Z',
        },
      })
      cy.signIn()
    })

    it('Submitting valid offence', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.form.fillInWith({
        offenceType: 'Theft Offences',
        offenceDate: new Date(2025, 0, 1),
      })
      page.form.saveAndContinueButton.click()
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          offenceType: 'THEFT_OFFENCES',
          offenceDate: '2025-01-01T00:00:00.000Z',
        },
      }).should('be.true')
      Page.verifyOnPage(OffenceListPage)
    })
  })

  context('Notifying organisation is prison', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder('PRISON')

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: {
          offenceType: 'THEFT_OFFENCES',
          offenceDate: '2020-01-01T00:00:00Z',
        },
      })
      cy.signIn()
    })

    it('Submitting valid offence', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.form.fillInWith({
        offenceType: 'Theft Offences',
      })
      page.form.saveAndContinueButton.click()
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          offenceType: 'THEFT_OFFENCES',
        },
      }).should('be.true')
      Page.verifyOnPage(OffenceOtherInfoPage)
    })
  })
})
