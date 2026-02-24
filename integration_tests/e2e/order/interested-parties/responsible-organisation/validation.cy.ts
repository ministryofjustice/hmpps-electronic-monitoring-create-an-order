import { v4 as uuidv4 } from 'uuid'
import ResponsibleOrganisationPage from './responsibleOrganisationPage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })
    cy.signIn()
  })

  it('should show error when no responsible organisation selected', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(['Select the organisation you are apart of'])
    page.form.responsibleOrganisationField.shouldHaveValidationMessage('Select the organisation you are apart of')
  })

  it('should show error when responsible organisation set as Probation, but no region selected', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })
    page.form.fillInWith({
      responsibleOrganisation: 'Probation',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(["Select the responsible officer's organisation"])
    page.form.responsibleOrganisationField.shouldHaveValidationMessage("Select the responsible officer's organisation")
  })

  it('should show error when responsible organisation set as Police, but no police area selected', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })
    page.form.fillInWith({
      responsibleOrganisation: 'Police',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(["Select the responsible officer's organisation"])
    page.form.responsibleOrganisationField.shouldHaveValidationMessage("Select the responsible officer's organisation")
  })

  it('should show error when responsible organisation set as YJS, but no region selected', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })
    page.form.fillInWith({
      responsibleOrganisation: 'Youth Justice Service (YJS)',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()
    page.errorSummary.shouldExist()
    page.errorSummary.verifyErrorSummary(["Select the responsible officer's organisation"])
    page.form.responsibleOrganisationField.shouldHaveValidationMessage("Select the responsible officer's organisation")
  })
})
