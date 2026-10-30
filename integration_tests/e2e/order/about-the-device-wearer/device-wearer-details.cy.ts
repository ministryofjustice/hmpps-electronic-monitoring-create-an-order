import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import DeviceWearerDetailsPage from '../../../pages/order/about-the-device-wearer/device-wearer-details'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import DeviceWearerSearchResultsPage from '../../../pages/order/about-the-device-wearer/device-wearer-search-results'
import OrderSummaryPage from '../../../pages/order/summary'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import paths from '../../../../server/constants/paths'

// A fresh order for every test, so answers cached by the app for one test cannot leak into another
let mockOrderId: string
const detailsPath = () => paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', mockOrderId)
const disabilitiesPath = () => paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', mockOrderId)

const savedDeviceWearer = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: 'Jane',
  middleName: 'Ann',
  lastName: 'Example',
  alias: 'Janey',
  dateOfBirth: '1990-03-04T00:00:00Z',
  adultAtTimeOfInstallation: true,
  sex: 'FEMALE',
  gender: 'NON_BINARY',
  disabilities: null,
  noFixedAbode: null,
  interpreterRequired: null,
}

const personalDetailsQuestions = [
  "What is the device wearer's first name?",
  "What is the device wearer's middle name?",
  "What is the device wearer's last name?",
  "What is the device wearer's preferred name or names? (optional)",
  "What is the device wearer's date of birth?",
  'What is the sex of the device wearer?',
  "What is the device wearer's gender?",
]

context('About the device wearer', () => {
  context('Device wearer details (Personal details)', () => {
    beforeEach(() => {
      mockOrderId = uuidv4()
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    })

    context('Draft order', () => {
      beforeEach(() => {
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })

      it('shows only the personal details questions', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.firstNameField.shouldExist()
        page.form.middleNameField.shouldExist()
        page.form.lastNameField.shouldExist()
        page.form.aliasField.shouldExist()
        page.form.dateOfBirthField.shouldExist()
        page.form.shouldHaveAllOptions()
        page.form.sexField.shouldNotHaveValue()
        page.form.genderIdentityField.shouldNotHaveValue()

        cy.contains('Does the device wearer have any of the disabilities or health conditions listed?').should(
          'not.exist',
        )
        cy.contains('Is an interpreter needed?').should('not.exist')
        cy.contains('Is a responsible adult required?').should('not.exist')
        page.form.continueButton.should('exist')
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
      })

      it('does not offer "Prefer not to say" for sex', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.sexField.shouldNotHaveOption('Prefer not to say')
      })

      it('shows an "or" divider for the sex and gender questions', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.sexField.shouldHaveDivider('or')
        page.form.genderIdentityField.shouldHaveDivider('or')
      })

      it('shows the existing validation errors when nothing is entered', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.continueButton.click()

        cy.location('pathname').should('eq', detailsPath())
        page.errorSummary.shouldExist()
        page.form.firstNameField.shouldHaveValidationMessage("Enter device wearer's first name")
        page.form.lastNameField.shouldHaveValidationMessage("Enter device wearer's last name")
        page.form.dateOfBirthField.shouldHaveValidationMessage('Enter date of birth')
        page.form.sexField.shouldHaveValidationMessage(
          "Select the device wearer's sex, or select 'Not able to provide this information'",
        )
        page.form.genderIdentityField.shouldHaveValidationMessage(
          "Select the device wearer's gender, or select 'Not able to provide this information'",
        )
      })

      it('keeps entered values when redisplaying errors', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({ firstName: 'Jane', sex: 'Female' })
        page.form.continueButton.click()

        page.form.firstNameField.shouldHaveValue('Jane')
        page.form.sexField.shouldHaveValue('Female')
      })

      it('continues to the disability and health conditions page and keeps the answers', () => {
        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.fillInWith({
          firstName: 'Jane',
          middleName: 'Ann',
          lastName: 'Example',
          alias: 'Janey',
          dob: new Date(1990, 2, 4),
          sex: 'Female',
          genderIdentity: 'Non binary',
        })
        page.form.continueButton.click()

        cy.location('pathname').should('eq', disabilitiesPath())

        const revisited = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })
        revisited.form.firstNameField.shouldHaveValue('Jane')
        revisited.form.middleNameField.shouldHaveValue('Ann')
        revisited.form.lastNameField.shouldHaveValue('Example')
        revisited.form.aliasField.shouldHaveValue('Janey')
        revisited.form.dateOfBirthField.shouldHaveValue(new Date(1990, 2, 4))
        revisited.form.sexField.shouldHaveValue('Female')
        revisited.form.genderIdentityField.shouldHaveValue('Non binary')
      })
    })

    context('Saved answers', () => {
      it('prefills the page from the order', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { deviceWearer: savedDeviceWearer },
        })
        cy.signIn()

        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.firstNameField.shouldHaveValue('Jane')
        page.form.lastNameField.shouldHaveValue('Example')
        page.form.dateOfBirthField.shouldHaveValue(new Date(1990, 2, 4))
        page.form.sexField.shouldHaveValue('Female')
        page.form.genderIdentityField.shouldHaveValue('Non binary')
      })
    })

    context('Submitted order', () => {
      it('shows the saved answers read-only', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: { deviceWearer: savedDeviceWearer },
        })
        cy.signIn()

        const page = Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })

        page.form.firstNameField.shouldHaveValue('Jane')
        page.form.genderIdentityField.shouldHaveValue('Non binary')
        page.form.shouldBeDisabled()
        page.form.saveAsDraftButton.should('not.exist')
        page.checkIsAccessible()

        // As a single question page, Continue is still shown; it returns to the order summary without saving
        page.form.continueButton.should('exist').click()
        cy.location('pathname').should('eq', paths.ORDER.SUMMARY.replace(':orderId', mockOrderId))
        cy.task('getStubbedRequest', `/orders/${mockOrderId}/device-wearer`).should('have.length', 0)
      })
    })

    context('Person found in the Core Person Record', () => {
      const searchedIdentifier = 'A1234BC'

      const confirmPersonFound = (gender: string | null): DeviceWearerDetailsPage => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            deviceWearer: {
              ...savedDeviceWearer,
              firstName: 'Ermintrude',
              lastName: 'Jones',
              alias: null,
              middleName: null,
              sex: 'FEMALE',
              gender,
            },
          },
        })
        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: `orders/${mockOrderId}/device-wearer-details\\?organisationSearchId=${searchedIdentifier}`,
          response: {
            firstName: 'Ermintrude',
            lastName: 'Jones',
            dateOfBirth: '1974-01-19T00:00:00Z',
            organisationSearchId: searchedIdentifier,
          },
        })
        // Same stub shape as device-wearer-search-results.submission.cy.ts (the real API responds 204 No Content)
        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'PUT',
          subPath: `orders/${mockOrderId}/device-wearer-details`,
          response: {},
        })
        cy.signIn()

        const searchResults = Page.visit(DeviceWearerSearchResultsPage, {
          orderId: mockOrderId,
          identifyNumber: searchedIdentifier,
        })
        searchResults.form.useThisDeviceWearerButton.click()

        return Page.visit(DeviceWearerDetailsPage, { orderId: mockOrderId })
      }

      it('leaves gender unselected when CPR supplies no gender and requires an explicit answer', () => {
        const page = confirmPersonFound(null)

        page.form.firstNameField.shouldHaveValue('Ermintrude')
        page.form.sexField.shouldHaveValue('Female')
        page.form.genderIdentityField.shouldNotHaveValue()
        page.checkIsAccessible()

        page.form.continueButton.click()

        cy.location('pathname').should('eq', detailsPath())
        page.form.genderIdentityField.shouldNotHaveValue()
        page.form.genderIdentityField.shouldHaveValidationMessage(
          "Select the device wearer's gender, or select 'Not able to provide this information'",
        )
        page.checkIsAccessible()
      })

      it('preserves a gender supplied by CPR', () => {
        const page = confirmPersonFound('NON_BINARY')

        page.form.genderIdentityField.shouldHaveValue('Non binary')
      })
    })

    context('Check your answers', () => {
      it('opens the device wearer task when scenario setup starts at the order summary', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            deviceWearer: {
              ...savedDeviceWearer,
              nomisId: 'A1234BC',
              disabilities: 'NONE',
              interpreterRequired: false,
              noFixedAbode: true,
            },
            contactDetails: { phoneNumberAvailable: false, contactNumber: '' },
          },
        })
        cy.signIn()

        Page.visit(OrderSummaryPage, { orderId: mockOrderId })
        fillInAboutTheDeviceWearer({ deviceWearerDetails: {} })

        Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')
      })

      it('links the personal details answers to the personal details page', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { deviceWearer: savedDeviceWearer },
        })
        cy.signIn()

        const page = Page.visit(DeviceWearerCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')

        personalDetailsQuestions.forEach(question => {
          page.changeLinkByQuestion(question).should('have.attr', 'href', detailsPath())
        })

        page.changeLinkByQuestion("What is the device wearer's first name?").click()
        Page.verifyOnPage(DeviceWearerDetailsPage, { orderId: mockOrderId })
      })
    })
  })
})
