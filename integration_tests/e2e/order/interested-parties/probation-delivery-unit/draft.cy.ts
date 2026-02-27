import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'

const mockOrderId = uuidv4()

context('probation delivery unit page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
        interestedParties: {
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
          notifyingOrganisationEmail: 'notifying@organisation',
          responsibleOrganisation: 'PROBATION',
          responsibleOrganisationRegion: 'GREATER_MANCHESTER',
          responsibleOrganisationEmail: 'responsible@organisation',
          responsibleOfficerFirstName: 'John',
          responsibleOfficerLastName: 'Smith',
          responsibleOfficerEmail: 'john.smith@probation.com',
        },
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.unitField.shouldExist()
    page.form.unitField.shouldHaveOption('Bolton')
    page.form.unitField.shouldHaveOption('Bury and Rochdale')
    page.form.unitField.shouldHaveOption('Manchester North')
    page.form.unitField.shouldHaveOption('Manchester South')
    page.form.unitField.shouldHaveOption('Oldham')
    page.form.unitField.shouldHaveOption('Stockport and Tameside')
    page.form.unitField.shouldHaveOption('Salford and Trafford')
    page.form.unitField.shouldHaveOption('Tameside')
    page.form.unitField.shouldHaveOption('Wigan')

    page.form.saveAndContinueButton.should('exist')
  })
})
