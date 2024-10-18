import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import { NotFoundErrorPage } from '../../../pages/error'
import NotifyingOrganisationPage from '../../../pages/order/contact-information/notifyingOrganisation'
import OrderTasksPage from '../../../pages/order/summary'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()
const pagePath = '/contact-information/notifying-organisation'

const mockSubmittedNotifyingOrganisation = {
  ...mockApiOrder('SUBMITTED'),
  notifyingOrganisation: {
    notifyingOrganisationEmail: 'first@last.gov.uk',
    officerName: 'Bob Smith',
    officerPhoneNumber: '07723456432',
    organisationType: 'PROBATION',
    organisationRegion: 'The Midlands',
    organisationAddressLine1: 'Line 1',
    organisationAddressLine2: 'Line 2',
    organisationAddressLine3: 'Line 3',
    organisationAddressLine4: 'Line 4',
    organisationAddressPostcode: 'NC4 5LB',
    organisationPhoneNumber: '07723456789',
    organisationEmail: 'test@prison.gov.uk',
  },
  id: mockOrderId,
}

const mockInProgressNotifyingOrganisation = {
  ...mockSubmittedNotifyingOrganisation,
  status: 'IN_PROGRESS',
}

const mockEmptyNotifyingOrganisation = {
  ...mockApiOrder('IN_PROGRESS'),
  notifyingOrganisation: {
    notifyingOrganisationEmail: null,
    officerName: null,
    officerPhoneNumber: null,
    organisationType: null,
    organisationRegion: null,
    organisationAddressLine1: null,
    organisationAddressLine2: null,
    organisationAddressLine3: null,
    organisationAddressLine4: null,
    organisationAddressPostcode: null,
    organisationPhoneNumber: null,
    organisationEmail: null,
  },
  id: mockOrderId,
}

const checkFormFields = () => {
  const { notifyingOrganisation: mockedData } = mockSubmittedNotifyingOrganisation

  cy.get('input[name="notifyingOrganisationEmail"]').should('have.value', mockedData.notifyingOrganisationEmail)
  cy.get('input[name="officerName"]').should('have.value', mockedData.officerName)
  cy.get('input[name="officerPhoneNumber"]').should('have.value', mockedData.officerPhoneNumber)
  cy.get('input[type="radio"][value="PROBATION"]').should('be.checked')
  cy.get('input[name="organisationRegion"]').should('have.value', mockedData.organisationRegion)
  cy.get('input[name="organisationAddressLine1"]').should('have.value', mockedData.organisationAddressLine1)
  cy.get('input[name="organisationAddressLine2"]').should('have.value', mockedData.organisationAddressLine2)
  cy.get('input[name="organisationAddressLine3"]').should('have.value', mockedData.organisationAddressLine3)
  cy.get('input[name="organisationAddressLine4"]').should('have.value', mockedData.organisationAddressLine4)
  cy.get('input[name="organisationAddressPostcode"]').should('have.value', mockedData.organisationAddressPostcode)
  cy.get('input[name="organisationPhoneNumber"]').should('have.value', mockedData.organisationPhoneNumber)
  cy.get('input[name="organisationEmail"]').should('have.value', mockedData.organisationEmail)
}

context('Contact details - Contact information', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue/return buttons', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('not.exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Submitted Order', () => {
    it('Should correctly display the submitted data in disabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedNotifyingOrganisation,
      })
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/notifying-organisation`)
      const page = Page.verifyOnPage(NotifyingOrganisationPage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
      page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
    })
  })

  context('Unsubmitted Order', () => {
    it('Should correctly display the data in enabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressNotifyingOrganisation,
      })
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/notifying-organisation`)
      const page = Page.verifyOnPage(NotifyingOrganisationPage)
      page.submittedBanner().should('not.exist')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
      page.backToSummaryButton.should('not.exist')
    })
  })

  context('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyNotifyingOrganisation,
      })
    })

    it('should correctly display errors', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/notifying-organisation',
        response: [
          { field: 'notifyingOrganisationEmail', error: 'You must enter a valid email' },
          { field: 'officerName', error: 'You must enter an officer name' },
          { field: 'officerPhoneNumber', error: 'You must enter a valid phone number' },
          { field: 'organisationType', error: 'You must select an organisation type' },
          { field: 'organisationRegion', error: 'You must enter an organisation region' },
          { field: 'organisationAddress', error: 'You must enter a valid address' },
          { field: 'organisationPhoneNumber', error: 'You must enter a phone number' },
          { field: 'organisationEmail', error: 'You must enter a valid email' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/notifying-organisation`)
      const page = Page.verifyOnPage(NotifyingOrganisationPage)
      page.form.saveAndContinueButton.click()
      cy.get('#notifyingOrganisationEmail-error').should('contain', 'You must enter a valid email')
      cy.get('#officerName-error').should('contain', 'You must enter an officer name')
      cy.get('#officerPhoneNumber-error').should('contain', 'You must enter a valid phone number')
      cy.get('#organisationType-error').should('contain', 'You must select an organisation type')
      cy.get('#organisationRegion-error').should('contain', 'You must enter an organisation region')
      cy.get('#organisationAddress-error').should('contain', 'You must enter a valid address')
      cy.get('#organisationPhoneNumber-error').should('contain', 'You must enter a phone number')
      cy.get('#organisationEmail-error').should('contain', 'You must enter a valid email')
    })

    it('should correctly submit the data to the CEMO API and move to the next page (agreed location)', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/notifying-organisation',
        response: mockEmptyNotifyingOrganisation.notifyingOrganisation,
      })
      cy.signIn().visit(`/order/${mockOrderId}/contact-information/notifying-organisation`)
      const page = Page.verifyOnPage(NotifyingOrganisationPage)
      page.fillInForm()
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/notifying-organisation`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          notifyingOrganisationEmail: 'first@last.gov.uk',
          officerName: 'Bob Smith',
          officerPhoneNumber: '07723456432',
          organisationType: 'PROBATION',
          organisationRegion: 'The Midlands',
          organisationAddressLine1: 'Line 1',
          organisationAddressLine2: 'Line 2',
          organisationAddressLine3: 'Line 3',
          organisationAddressLine4: 'Line 4',
          organisationAddressPostcode: 'NC4 5LB',
          organisationPhoneNumber: '07723456789',
          organisationEmail: 'test@prison.gov.uk',
        })
      })
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
