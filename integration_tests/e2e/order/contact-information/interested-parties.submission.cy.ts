import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'
const sampleFormData = {
  notifyingOrganisationEmailAddress: 'notifying@organisation',
  responsibleOrganisationName: 'Police',
  responsibleOrganisationContactNumber: '01234567890',
  responsibleOrganisationEmailAddress: 'responsible@organisation',
  responsibleOrganisationRegion: 'region',
  responsibleOrganisationAddress: {
    line1: 'line1',
    line2: 'line2',
    line3: 'line3',
    line4: 'line4',
    postcode: 'postcode',
  },
  responsibleOfficerName: 'name',
  responsibleOfficerContactNumber: '01234567891',
}

context('Contact information', () => {
  context('Interested parties', () => {
    context('Submitting valid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationPhoneNumber: '01234567890',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'region',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: 'line1',
              addressLine2: 'line2',
              addressLine3: 'line3',
              addressLine4: 'line4',
              postcode: 'postcode',
            },
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted interested parties submission', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationPhoneNumber: '01234567890',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'region',
            responsibleOrganisationAddressLine1: 'line1',
            responsibleOrganisationAddressLine2: 'line2',
            responsibleOrganisationAddressLine3: 'line3',
            responsibleOrganisationAddressLine4: 'line4',
            responsibleOrganisationAddressPostcode: 'postcode',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        }).should('be.true')
      })

      it('should continue to collect installation and risk details', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })

    context('Submitting partial data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            notifyingOrganisationEmail: '',
            responsibleOrganisation: null,
            responsibleOrganisationPhoneNumber: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: 'line1',
              addressLine2: 'line2',
              addressLine3: '',
              addressLine4: '',
              postcode: 'postcode',
            },
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: null,
          },
        })

        cy.signIn()
      })

      it('should submit an interested parties submission with some fields not completed', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith({
          responsibleOrganisationAddress: {
            line1: 'line1',
            line2: 'line2',
            line3: '',
            line4: '',
            postcode: 'postcode',
          },
        })
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            notifyingOrganisationEmail: '',
            responsibleOrganisation: null,
            responsibleOrganisationPhoneNumber: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
            responsibleOrganisationAddressLine1: 'line1',
            responsibleOrganisationAddressLine2: 'line2',
            responsibleOrganisationAddressLine3: '',
            responsibleOrganisationAddressLine4: '',
            responsibleOrganisationAddressPostcode: 'postcode',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: null,
          },
        }).should('be.true')
      })
    })
  })
})
