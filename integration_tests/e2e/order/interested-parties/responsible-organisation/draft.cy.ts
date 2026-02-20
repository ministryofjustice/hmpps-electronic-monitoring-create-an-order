import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ResponsibleOrganisationPage from './responsibleOrganisationPage'

const mockOrderId = uuidv4()

context('Responsible organisation page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: { dataDictionaryVersion: 'DDV6' },
    })
    cy.signIn()
  })

  it('Has correct elements', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.responsibleOrganisationField.shouldExist()
    page.form.responsibleOrganisationField.shouldHaveAllOptions()
    page.form.responsibleOrganisationEmailAddressField.shouldExist()

    page.form.responsibleOrgProbationField.shouldHaveOption('Yorkshire and the Humber')
    page.form.policeAreaField.shouldHaveOption('National Crime Agency')
    page.form.yjsRegionField.shouldHaveOption('Yorkshire and Humberside')

    page.form.continueButton.should('exist')
  })
})
