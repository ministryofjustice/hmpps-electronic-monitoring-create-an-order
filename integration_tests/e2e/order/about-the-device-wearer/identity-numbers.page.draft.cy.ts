import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

const mockOrderId = uuidv4()

const testOrder = {
  deviceWearer: {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
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
  context('Identity numbers', () => {
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

        page.form.checkboxes.shouldHaveOption('National Offender Management Information System (NOMIS)')
        page.form.checkboxes.shouldHaveOption('Police National Computer (PNC)')
        page.form.checkboxes.shouldHaveOption('Prison Number')
        page.form.checkboxes.shouldHaveOption('NDelius ID')
        page.form.checkboxes.shouldHaveOption('Compliance and Enforcement Person Reference (CEPR)')
        page.form.checkboxes.shouldHaveOption('Court Case Reference Number (CCRN)')
        page.form.checkboxes.shouldHaveOption('Home Office Reference Number')
      })

      it('Should display the correct inputs', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        page.form.checkboxes.shouldHaveValue('National Offender Management Information System (NOMIS)')
        page.form.checkboxes.shouldHaveValue('Police National Computer (PNC)')
        page.form.checkboxes.shouldHaveValue('Compliance and Enforcement Person Reference (CEPR)')

        page.form.checkboxes.shouldNotHaveValueChecked('NDelius ID')
        page.form.nomisIdField.shouldHaveValue('nomis')
        page.form.pncIdField.shouldHaveValue('pnc')
        page.form.complianceField.shouldHaveValue('cepr')
        page.form.deliusIdField.shouldHaveValue('')
      })
    })
  })
})
