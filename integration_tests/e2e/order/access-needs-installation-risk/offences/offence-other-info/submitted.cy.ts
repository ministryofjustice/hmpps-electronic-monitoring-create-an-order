import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceOtherInfoPage from './offenceOtherInfoPage'

const mockOrderId = uuidv4()
const offenceAdditionalDetailsId = uuidv4()

context('offence other info page', () => {
  context('viewing a submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          interestedParties: {
            notifyingOrganisation: 'CROWN_COURT',
            notifyingOrganisationName: 'TEST',
            notifyingOrganisationEmail: 'test',
            responsibleOfficerName: 'test',
            responsibleOfficerPhoneNumber: '0',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationRegion: 'LONDON',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationPhoneNumber: '01234567891',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 1AA',
            },
          },
          offenceAdditionalDetails: {
            id: offenceAdditionalDetailsId,
            additionalDetails: 'Risk of violence towards staff',
          },
        },
      })

      cy.signIn()
    })

    it('can view existing offence other info and ot editable', () => {
      const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

      page.submittedBanner.should('contain', 'You are viewing a submitted order.')

      page.form.hasOtherInformationField.shouldHaveValue('Yes')
      page.form.otherInformationDetailsField.shouldHaveValue('Risk of violence towards staff')

      page.form.hasOtherInformationField.shouldBeDisabled()
      page.form.otherInformationDetailsField.shouldBeDisabled()

      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')

      page.backButton.should('exist')
      page.errorSummary.shouldNotExist()
    })
  })
})
