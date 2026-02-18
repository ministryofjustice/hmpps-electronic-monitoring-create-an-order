import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'
import ResponsibleOfficerPage from '../responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../responsible-organisation/responsibleOrganisationPage'

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

  it('not a court routes to responsbile office page', () => {
    const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({ organisation: 'Prison service', email: 'a@b.com' })
    page.form.continueButton.click()

    Page.verifyOnPage(ResponsibleOfficerPage)
  })

  it('a court routes to responsbile organisation page', () => {
    const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({ organisation: 'Family Court', email: 'a@b.com' })
    page.form.continueButton.click()

    Page.verifyOnPage(ResponsibleOrganisationPage)
  })

  it('navigating back to the page after submission shows values', () => {
    let page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({ organisation: 'Family Court', email: 'a@b.com' })
    page.form.continueButton.click()

    page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
    page.form.organisationField.shouldHaveValue('Family Court')
    page.form.emailField.shouldHaveValue('a@b.com')
  })
})
