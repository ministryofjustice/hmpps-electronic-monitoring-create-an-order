import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceOtherInfoPage from './offenceOtherInfoPage'

const mockOrderId = uuidv4()

const stubOrder = () => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      interestedParties: {
        notifyingOrganisation: 'CROWN_COURT',
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
      offenceAdditionalDetails: null,
    },
  })
}

context('Offence Other Info Validations', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubOrder()
    cy.signIn()
  })

  it('Should show error when submitting empty form', () => {
    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

    page.form.saveAndContinueButton.click()

    page.form.hasOtherInformationField.shouldHaveValidationMessage(
      'Select Yes if there is other information to be aware of about the offence committed',
    )
    page.errorSummary.shouldExist()
  })

  it('Should show error when Yes" is selected but details are empty', () => {
    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

    page.form.hasOtherInformationField.set('Yes')
    page.form.saveAndContinueButton.click()

    page.form.otherInformationDetailsField.shouldHaveValidationMessage('Enter additional information about the offence')
  })

  it('Should show error when details are too long (frontend validation)', () => {
    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

    page.form.hasOtherInformationField.set('Yes')

    const longText = 'a'.repeat(201)
    page.form.otherInformationDetailsField.set(longText)

    page.form.saveAndContinueButton.click()

    page.form.otherInformationDetailsField.shouldHaveValidationMessage(
      'Additional risk information must be 200 characters or fewer',
    )
  })
})
