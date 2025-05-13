import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

const mockOrderId = uuidv4()

context('Contact Information - check your answers', () => {
  context('Order that failed to submit to Serco', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })
    })

    it('should show answers without any actions', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      // Should show the correct answers
      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'No' },
      ])

      page.deviceWearerAddressesSection.shouldNotHaveItems([
        "What is the device wearer's main address?",
        "What is the device wearer's second address?",
        "What is the device wearer's third address?",
      ])
      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])

      // Should not have any "change" links
      page.changeLinks.should('not.exist')

      // Should show the correct buttons
      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
