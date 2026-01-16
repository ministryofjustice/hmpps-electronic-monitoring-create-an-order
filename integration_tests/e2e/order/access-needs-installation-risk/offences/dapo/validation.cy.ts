import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import DapoPage from './DapoPage'

const mockOrderId = uuidv4()
context('dapo order clause', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        interestedParties: {
          notifyingOrganisation: 'FAMILY_COURT',
          notifyingOrganisationName: '',
          notifyingOrganisationEmail: '',
          responsibleOfficerName: '',
          responsibleOfficerPhoneNumber: '',
          responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
          responsibleOrganisationAddress: {
            addressType: 'RESPONSIBLE_ORGANISATION',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            postcode: '',
          },
          responsibleOrganisationEmail: '',
          responsibleOrganisationPhoneNumber: '',
          responsibleOrganisationRegion: '',
        },
      },
    })

    cy.signIn()
  })

  it('shows the correct errors', () => {
    const page = Page.visit(DapoPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page.form.clauseNumberField.shouldHaveValidationMessage('Enter a DAPO order clause number')
    page.form.dateField.shouldHaveValidationMessage('Enter date of DAPO requirement')
  })

  it('shows errors from the backend', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 400,
      id: mockOrderId,
      subPath: `/dapo`,
      response: [{ field: 'clause', error: 'DAPO clause is too long' }],
    })

    const page = Page.visit(DapoPage, { orderId: mockOrderId })

    page.form.clauseNumberField.set('some clause over 20 character')
    page.form.dateField.set(new Date(2025, 1, 1))

    page.form.saveAndContinueButton.click()

    page.form.clauseNumberField.shouldHaveValidationMessage('DAPO clause is too long')
  })
})
