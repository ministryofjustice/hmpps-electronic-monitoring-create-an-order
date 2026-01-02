import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'

import UploadPhotoIdPage from '../../../../pages/order/attachments/uploadPhotoId'
import UploadCourtOrderPage from './uploadCourtOrderPage'

const mockOrderId = uuidv4()
const fileContent = 'This is an image'

context('Attachments', () => {
  context('Upload court order', () => {
    context('Submitting a valid file', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
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
        cy.task('stubUploadAttachment', { httpStatus: 200, id: mockOrderId, type: 'COURT_ORDER' })
        cy.signIn()
      })

      it('Should allow the user to upload a court order', () => {
        const page = Page.visit(UploadCourtOrderPage, { orderId: mockOrderId })

        page.form.fillInWith({
          file: {
            fileName: 'profile.jpeg',
            contents: fileContent,
          },
        })
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(UploadPhotoIdPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/document-type/COURT_ORDER`,
          fileContents: [
            {
              name: 'file',
              filename: 'profile.jpeg',
              contentType: 'image/jpeg',
              contents: fileContent,
            },
          ],
        }).should('be.true')
      })
    })
  })
})
