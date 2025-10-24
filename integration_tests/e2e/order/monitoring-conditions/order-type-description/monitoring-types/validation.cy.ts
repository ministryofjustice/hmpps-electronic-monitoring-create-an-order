import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'

const stubGetOrder = (notifyingOrg: string = 'PROBATION') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
    },
  })
}

const mockOrderId = uuidv4()
context('monitoringTypes', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('validation errors', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.form.monitoringTypesField.validationMessage.contains('Select monitoring required')
    page.errorSummary.shouldHaveError('Select monitoring required')
  })
})
