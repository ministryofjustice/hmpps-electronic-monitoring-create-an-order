import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffencePage from './offencePage'

const mockOrderId = uuidv4()
const stubOrder = (notifyingOrganisation = 'CROWN_COURT') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      interestedParties: {
        notifyingOrganisation,
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
}
context('Draft Offences', () => {
  context('Notifying organisation is court', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder()
      cy.signIn()
    })

    it('Should show errors when submit empty form', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.click()
      page.form.offenceTypeField.shouldHaveValidationMessage('Select the type of offence the device wearer committed')
      page.form.offenceDateField.shouldHaveValidationMessage('Enter date of offence the device wearer committed')
    })

    it('Should show error when offence date is not in the past', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.form.fillInWith({
        offenceType: 'Theft Offences',
        offenceDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      page.form.saveAndContinueButton.click()
      page.form.offenceDateField.shouldHaveValidationMessage(
        'Date of offence the device wearer committed must be in the past',
      )
    })
  })

  context('Notifying organisation is prison', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder('PRISON')
      cy.signIn()
    })

    it('Should show errors when submit empty form', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.click()

      page.errorSummary.shouldExist()
      page.errorSummary.shouldHaveError('Select the type of offence the device wearer committed')
      page.errorSummary.shouldNotHaveError('Enter date of offence the device wearer committed')
      page.form.offenceTypeField.shouldHaveValidationMessage('Select the type of offence the device wearer committed')
    })
  })
})
