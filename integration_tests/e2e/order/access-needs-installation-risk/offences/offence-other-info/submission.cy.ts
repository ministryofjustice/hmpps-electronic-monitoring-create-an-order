import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceOtherInfoPage from './offenceOtherInfoPage'
import OrderTasksPage from '../../../../../pages/order/summary'
import DetailsOfInstallationPage from '../../details-of-installation/DetailsOfInstallationPage'

const mockOrderId = uuidv4()
const apiPath = '/offence-additional-details'

context('Offence Other Info Page', () => {
  context('Submitting valid offence additional details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          interestedParties: {
            notifyingOrganisation: 'CROWN_COURT',
            notifyingOrganisationName: 'TEST',
            notifyingOrganisationEmail: 'test',
            responsibleOfficerName: 'test',
            responsibleOfficerPhoneNumber: '0',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationRegion: 'LONDON',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationPhoneNumber: '01234567891',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 1AA',
            },
          },
          offenceAdditionalDetails: null,
        },
      })

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: {
          id: uuidv4(),
          additionalDetails: 'Risk of violence',
        },
      })

      cy.signIn()
    })

    it('should submit the correct data and continue to the next page', () => {
      const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

      const validFormData = {
        hasOtherInformation: 'Yes' as const,
        otherInformationDetails: 'Risk of violence',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          additionalDetailsRequired: true,
          additionalDetails: 'Risk of violence',
        },
      }).should('be.true')

      Page.verifyOnPage(DetailsOfInstallationPage)
    })

    it('should return to summary page when save as draft', () => {
      const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

      const validFormData = {
        hasOtherInformation: 'Yes' as const,
        otherInformationDetails: 'Draft details',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAsDraftButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          additionalDetailsRequired: true,
          additionalDetails: 'Draft details',
        },
      }).should('be.true')

      Page.verifyOnPage(OrderTasksPage)
    })

    it('can update existing offence additional details', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          interestedParties: {
            notifyingOrganisation: 'CROWN_COURT',
            notifyingOrganisationName: 'Crown Court Name',
            notifyingOrganisationEmail: 'test@example.com',
            responsibleOfficerName: 'Officer Name',
            responsibleOfficerPhoneNumber: '0123456789',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationRegion: 'London',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationPhoneNumber: '0987654321',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '1 Street',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 1AA',
            },
          },
          offenceAdditionalDetails: {
            id: uuidv4(),
            additionalDetails: 'Old risk information',
          },
        },
      })

      const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

      page.form.hasOtherInformationField.shouldHaveValue('Yes')
      page.form.otherInformationDetailsField.shouldHaveValue('Old risk information')

      page.form.otherInformationDetailsField.element.clear()

      page.form.fillInWith({
        hasOtherInformation: 'Yes' as const,
        otherInformationDetails: 'Updated risk information',
      })

      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          additionalDetailsRequired: true,
          additionalDetails: 'Updated risk information',
        },
      }).should('be.true')
    })
  })
})
