import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../mockApis/cemo'
import ErrorPage from '../../pages/error'
import InstallationAndRiskPage from '../../pages/order/installationAndRisk'
import OrderTasksPage from '../../pages/order/summary'
import Page from '../../pages/page'

const mockOrderId = uuidv4()

const mockSubmittedInstallationAndRisk = {
  ...mockApiOrder('SUBMITTED'),
  installationAndRisk: {
    riskOfSeriousHarm: 'MEDIUM',
    riskOfSelfHarm: 'LOW',
    riskCategory: ['VIOLENCE', 'GENDER', 'SUBSTANCE_ABUSE'],
    riskDetails: 'Details about the risk',
    mappaLevel: 'MAPPA2',
    mappaCaseType: 'SPECIAL_IMMIGRATION_APPEALS',
  },
  id: mockOrderId,
}

const mockInProgressInstallationAndRisk = {
  ...mockSubmittedInstallationAndRisk,
  status: 'IN_PROGRESS',
}

const mockEmptyInstallationAndRisk = {
  ...mockApiOrder('IN_PROGRESS'),
  installationAndRisk: {
    riskOfSeriousHarm: null,
    riskOfSelfHarm: null,
    riskCategory: null,
    riskDetails: null,
    mappaLevel: null,
    mappaCaseType: null,
  },
  id: mockOrderId,
}

const checkFormFields = () => {
  cy.get('input[name="riskOfSeriousHarm"][value="MEDIUM"]').should('be.checked')
  cy.get('input[name="riskOfSelfHarm"][value="LOW"]').should('be.checked')
  cy.get('input[name="riskCategory[]"][value="VIOLENCE"]').should('be.checked')
  cy.get('input[name="riskCategory[]"][value="GENDER"]').should('be.checked')
  cy.get('input[name="riskCategory[]"][value="SUBSTANCE_ABUSE"]').should('be.checked')
  cy.get('textarea[name="riskDetails"]').should('have.value', 'Details about the risk')
  cy.get('input[name="mappaLevel"][value="MAPPA2"]').should('be.checked')
  cy.get('input[name="mappaCaseType"][value="SPECIAL_IMMIGRATION_APPEALS"]').should('be.checked')
}

context('Installation and risk section', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
  })

  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should be accessible', () => {
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.checkIsAccessible()
    })
  })

  context('Submitted Order', () => {
    it('Should correctly display the submitted data in disabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedInstallationAndRisk,
      })
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('textarea').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
    })
  })

  context('In Progress Order', () => {
    it('Should correctly display the submitted data in enabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressInstallationAndRisk,
      })
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.submittedBanner().should('not.exist')
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      cy.get('textarea').each($el => {
        cy.wrap($el).should('be.enabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })
  })

  context.skip('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyInstallationAndRisk,
      })
    })

    it('should show errors with an empty form submission', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/installation-and-risk',
        response: [
          { field: 'riskOfSeriousHarm', error: 'You must select an option' },
          { field: 'riskOfSelfHarm', error: 'You must select an option' },
          { field: 'riskCategory', error: 'You must select an option' },
          { field: 'riskDetails', error: 'You must enter some text' },
          { field: 'mappaLevel', error: 'You must select an option' },
          { field: 'mappaCaseType', error: 'You must select an option' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.saveAndContinueButton().click()
      cy.get('#riskOfSeriousHarm-error').should('contain', 'You must select an option')
      cy.get('#riskOfSelfHarm-error').should('contain', 'You must select an option')
      cy.get('#riskCategory-error').should('contain', 'You must select an option')
      cy.get('#riskDetails-error').should('contain', 'You must enter some text')
      cy.get('#mappaLevel-error').should('contain', 'You must select an option')
      cy.get('#mappaCaseType-error').should('contain', 'You must select an option')
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/installation-and-risk',
        response: mockEmptyInstallationAndRisk.installationAndRisk,
      })
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`)
      const page = Page.verifyOnPage(InstallationAndRiskPage)
      page.fillInForm()
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/installation-and-risk`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          riskOfSeriousHarm: 'MEDIUM',
          riskOfSelfHarm: 'LOW',
          riskCategory: ['VIOLENCE', 'GENDER', 'SUBSTANCE_ABUSE'],
          riskDetails: 'Details about the risk',
          mappaLevel: 'MAPPA2',
          mappaCaseType: 'SPECIAL_IMMIGRATION_APPEALS',
        })
      })
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/installation-and-risk`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
