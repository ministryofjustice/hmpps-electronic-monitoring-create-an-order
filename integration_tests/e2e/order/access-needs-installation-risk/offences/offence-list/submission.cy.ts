import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceListPage from './offenceListPage'
import OffencePage from '../offence/offencePage'
import DapoPage from '../dapo/DapoPage'
import OffenceOtherInfoPage from '../offence-other-info/offenceOtherInfoPage'
import DetailsOfInstallationPage from '../../details-of-installation/DetailsOfInstallationPage'
import OrderTasksPage from '../../../../../pages/order/summary'

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

    it('Should go to add new offence page if selected yes', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addOffence: 'Yes',
      })
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(OffencePage)
    })

    it('Should got to offence other info page if selected no', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addOffence: 'No',
      })
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(OffenceOtherInfoPage)
    })

    it('Should got to order summary page if save as draft', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addOffence: 'No',
      })
      page.form.saveAsDraftButton.click()

      Page.verifyOnPage(OrderTasksPage)
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

    it('Should got to add new dapo clause page if selected yes', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'DAPO order clauses')

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addDapoClause: 'Yes',
      })
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(DapoPage)
    })

    it('Should got to details for installation page if selected No', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'DAPO order clauses')

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addDapoClause: 'No',
      })
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(DetailsOfInstallationPage)
    })

    it('Should got to order summary page if save as draft', () => {
      const page = Page.visit(OffenceListPage, { orderId: mockOrderId }, undefined, 'DAPO order clauses')

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.fillInWith({
        addDapoClause: 'No',
      })
      page.form.saveAsDraftButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })
  })
})
