import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ResponsibleOfficerPage from './responsibleOfficerPage'

context('Responsible officer page', () => {
  const mockOrderId = uuidv4()
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        interestedParties: {
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'Mock Prison',
          notifyingOrganisationEmail: 'mock@email.com',
          responsibleOrganisation: 'PROBATION',
          responsibleOrganisationRegion: 'Somewhere',
          responsibleOrganisationEmail: 'some@where.com',
          responsibleOfficerFirstName: 'John',
          responsibleOfficerLastName: 'Smith',
          responsibleOfficerEmail: 'A@B.com',
        },
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })

    page.form.firstNameField.shouldExist()
    page.form.lastNameField.shouldExist()
    page.form.emailField.shouldExist()
  })

  it('Should pre-populate data from API', () => {
    const page = Page.visit(ResponsibleOfficerPage, { orderId: mockOrderId })
    page.form.firstNameField.shouldHaveValue('John')
    page.form.lastNameField.shouldHaveValue('Smith')
    page.form.emailField.shouldHaveValue('A@B.com')
  })
})
