import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceListPage from './offenceListPage'

const mockOrderId = uuidv4()
context('Offence list page', () => {
  context('Offence list view', () => {
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
          offences: [
            {
              id: mockOrderId,
              offenceType: 'THEFT_OFFENCES',
              offenceDate: '2025-01-12T00:00:00Z',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('validation errors', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.saveAndContinueButton.click()

      page.errorSummary.shouldExist()
      page.form.addAnotherOffenceField.validationMessage.contains(
        'Select Yes if there are any other offences the device wearer has committed',
      )
      page.errorSummary.shouldHaveError('Select Yes if there are any other offences the device wearer has committed')
    })
  })

  context('dapo clause list view', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
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
          dapoClauses: [
            {
              id: mockOrderId,
              clause: '32566563334345',
              date: '2025-01-12T00:00:00Z',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('validation errors', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'DAPO order clauses')

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.saveAndContinueButton.click()

      page.errorSummary.shouldExist()
      page.form.addAnotherDapoField.validationMessage.contains('Select Yes if there are any other DAPO order clauses')
      page.errorSummary.shouldHaveError('Select Yes if there are any other DAPO order clauses')
    })
  })
})
