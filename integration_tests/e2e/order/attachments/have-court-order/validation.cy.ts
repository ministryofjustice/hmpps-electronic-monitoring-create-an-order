import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import CourtOrderDocumentPage from './courtOrderDocumentPage'

const mockOrderId = uuidv4()

const apiPath = '/attachments/COURT_ORDER'
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        interestedParties: {
          notifyingOrganisation: 'FAMILY_COURT',
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
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {},
    })
    cy.signIn()
  })

  it('Should show errors no answer selected', () => {
    const page = Page.visit(CourtOrderDocumentPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.saveAndContinueButton.click()

    page.errorSummary.shouldExist()
    page.form.haveCourtOrderField.validationMessage.contains('Select Yes if you have a document to upload')
  })
})
