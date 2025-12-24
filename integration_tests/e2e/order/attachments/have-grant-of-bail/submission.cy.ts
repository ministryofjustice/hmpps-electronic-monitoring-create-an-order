import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import HaveGrantOfBailPage from './haveGrantOfBailPage'
import UploadGrantOfBailPage from '../upload-grant-of-bail/uploadGrantOfBailPage'

const mockOrderId = uuidv4()
const apiPath = '/attachments/fileRequired'
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        interestedParties: {
          notifyingOrganisation: 'HOME_OFFICE',
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

  it('Should continue to upload grant of bail page', () => {
    const page = Page.visit(HaveGrantOfBailPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/attachments/fileRequired`,
      body: {
        fileType: 'GRANT_OF_BAIL',
        fileRequired: true,
      },
    }).should('be.true')
    Page.verifyOnPage(UploadGrantOfBailPage)
  })
})
