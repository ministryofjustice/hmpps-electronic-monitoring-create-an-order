import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()

const testOrder = {
  interestedParties: {
    notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
  },
  deviceWearer: {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: null,
    prisonNumber: null,
    complianceAndEnforcementPersonReference: 'cepr',
    courtCaseReferenceNumber: null,
    firstName: 'test',
    lastName: 'tester',
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: 'PREFER_TO_SELF_DESCRIBE',
    disabilities: 'OTHER',
    otherDisability: 'Broken arm',
    noFixedAbode: null,
    interpreterRequired: null,
  },
}

context('About the device wearer', () => {
  context('Identity numbers youth cohort', () => {
    context('Viewing a draft order with existing id numbers', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order: testOrder })

        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.backButton.should('exist')
        page.errorSummary.shouldNotExist()
        page.checkIsAccessible()

        page.form.checkboxes.shouldHaveAllOptions()
      })

      it('Should display the correct inputs for youth user', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.checkboxes.shouldHaveValue('Prison number')
        page.form.checkboxes.shouldHaveValue('Police National Computer (PNC)')

        page.form.field('nomisId').shouldHaveValue('nomis')
        page.form.field('pncId').shouldHaveValue('pnc')
      })

      it('Should not have unexpected identity number fields', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.form.checkboxes.shouldNotHaveOption('Case Reference Number (CRN)')
        page.form.checkboxes.shouldNotHaveOption('Compliance and Enforcement Person Reference (CEPR)')
        page.form.checkboxes.shouldNotHaveOption('Court Case Reference Number (CCRN)')
      })
    })
  })
  context('Identity numbers prison cohort', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: { ...testOrder, interestedParties: { notifyingOrganisation: 'PRISON' } },
      })

      cy.signIn()
    })
    it('Should display the correct inputs for prison user', () => {
      // Should have correct header
      const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, ['prisonNumber'])
      page.form.singleField('nomisId').shouldHaveValue('nomis')
    })
  })
  context('Identity numbers home office cohort', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: { ...testOrder, interestedParties: { notifyingOrganisation: 'HOME_OFFICE' } },
      })

      cy.signIn()
    })
    it('Should display the correct inputs for home ofice user', () => {
      // Should have correct header
      const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, [
        'complianceAndEnforcementPersonReference',
      ])
      page.form.singleField('complianceAndEnforcementPersonReference').shouldHaveValue('cepr')
    })
    context('Identity numbers probation cohort', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            ...testOrder,
            deviceWearer: { ...testOrder.deviceWearer, courtCaseReferenceNumber: 'crn' },
            interestedParties: { notifyingOrganisation: 'PROBATION' },
          },
        })

        cy.signIn()
      })
      it('Should display the correct inputs for probation user', () => {
        // Should have correct header
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId }, {}, [
          'prisonNumber',
          'courtCaseReferenceNumber',
        ])
        page.form.checkboxes.shouldHaveValue('Prison number')
        page.form.checkboxes.shouldHaveValue('Case Reference Number (CRN)')

        page.form.field('prisonNumber').shouldHaveValue('nomis')
        page.form.field('courtCaseReferenceNumber').shouldHaveValue('crn')
      })
    })
  })
})
