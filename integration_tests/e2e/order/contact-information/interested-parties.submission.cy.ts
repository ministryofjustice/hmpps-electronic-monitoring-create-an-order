import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'
const sampleFormData = {
  notifyingOrganisationEmailAddress: 'notifying@organisation',
  responsibleOrganisationName: 'org',
  responsibleOrganisationContactNumber: '01234567890',
  responsibleOrganisationEmailAddress: 'responsible@organisation',
  responsibleOrganisationRegion: 'region',
  responsbibleOrganisationAddress: {
    line1: 'line1',
    line2: 'line2',
    city: 'line3',
    county: 'line4',
    postcode: 'line5',
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
            contactNumber: '01234567890',
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
            notifyingOrganisationEmailAddress: 'notifying@organisation',

            responsibleOrganisationName: 'org',
            responsibleOrganisationContactNumber: '01234567890',
            responsibleOrganisationEmailAddress: 'responsible@organisation',
            responsibleOrganisationRegion: 'region',
            responsbibleOrganisationAddressLine1: 'line1',
            responsbibleOrganisationAddressLine2: 'line2',
            responsbibleOrganisationAddressLine3: 'line3',
            responsbibleOrganisationAddressLin4: 'line4',
            responsbibleOrganisationAddressPostcode: 'line5',

            responsibleOfficerName: 'name',
            responsibleOfficerContactNumber: '01234567891',
          },
        }).should('be.true')
      })

      it('should continue to collect installation and risk details', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAndRiskPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
