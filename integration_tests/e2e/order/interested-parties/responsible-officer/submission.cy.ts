import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ResponsibleOfficerPage from './responsibleOfficerPage'
import ResponsibleOrganisationPage from '../responsible-organisation/responsibleOrganisationPage'

context('Responsible officer page', () => {
  const mockOrderId = uuidv4()
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('Should continue to responsible organisation page', () => {
    const page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.fillInWith({
      firstName: 'John',
      lastName: 'Smith',
      email: 'A@B.com',
    })
    page.form.continueButton.click()

    Page.verifyOnPage(ResponsibleOrganisationPage)
  })

  it('Should show previous entered value after come back to the page', () => {
    let page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.fillInWith({
      firstName: 'John',
      lastName: 'Smith',
      email: 'A@B.com',
    })
    page.form.continueButton.click()

    Page.verifyOnPage(ResponsibleOrganisationPage)
    page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.firstNameField.shouldHaveValue('John')
    page.form.lastNameField.shouldHaveValue('Smith')
    page.form.emailField.shouldHaveValue('A@B.com')
  })
})
