import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()

const mockDeviceWearer = {
  nomisId: 'nomis',
  pncId: 'pnc',
  deliusId: 'delius',
  prisonNumber: 'prison',
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: 'cepr',
  courtCaseReferenceNumber: 'ccrn',
  firstName: 'test',
  lastName: 'tester',
  alias: null,
  dateOfBirth: null,
  adultAtTimeOfInstallation: null,
  sex: null,
  gender: null,
  disabilities: null,
  noFixedAbode: null,
  interpreterRequired: null,
}

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: { deviceWearer: mockDeviceWearer },
        })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should display the submitted order notification', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      })

      it('Should not allow the user to update the identity numbers details', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.backButton.should('exist').should('have.attr', 'href', '#')
        page.form.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })

      it('Should display the submitted values in the disabled form', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.checkboxes.shouldHaveValue('National Offender Management Information System (NOMIS)')
        page.form.checkboxes.shouldHaveValue('Police National Computer (PNC)')
        page.form.checkboxes.shouldHaveValue('NDelius ID')
        page.form.checkboxes.shouldHaveValue('Prison Number')
        page.form.checkboxes.shouldHaveValue('Compliance and Enforcement Person Reference (CEPR)')
        page.form.checkboxes.shouldHaveValue('Court Case Reference Number (CCRN)')

        page.form.nomisIdField.shouldHaveValue('nomis')
        page.form.pncIdField.shouldHaveValue('pnc')
        page.form.deliusIdField.shouldHaveValue('delius')
        page.form.prisonNumberField.shouldHaveValue('prison')
        page.form.complianceField.shouldHaveValue('cepr')
        page.form.courtCaseField.shouldHaveValue('ccrn')
      })
    })
  })
})
