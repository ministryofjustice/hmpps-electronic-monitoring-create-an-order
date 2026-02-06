import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceListPage from './offenceListPage'

const mockOrderId = uuidv4()
context('offence list page', () => {
  context('Offence list view', () => {
    beforeEach(() => {
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
    it('has correct elements', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'Offences committed')
      page.form.summaryList.shouldExist()
      page.form.summaryList.shouldHaveItem('Theft Offences', 'on 12/01/2025')
      cy.get('form')
        .find('legend')
        .contains('Are there any other offences that the device wearer has committed?')
        .should('exist')
      cy.get('form').find('legend').contains('Are there any other DAPO order clauses?').should('not.exist')
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
    })
  })

  context('Dapo list view', () => {
    beforeEach(() => {
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
    it('has correct elements', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'DAPO order clauses')
      page.form.summaryList.shouldExist()
      page.form.summaryList.shouldHaveItem('32566563334345', 'on 12/01/2025')
      cy.get('form')
        .find('legend')
        .contains('Are there any other offences that the device wearer has committed?')
        .should('not.exist')
      cy.get('form').find('legend').contains('Are there any other DAPO order clauses?').should('exist')
      page.form.saveAsDraftButton.should('exist')
    })
  })
})
