import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'

const mockOrderId = uuidv4()

const mockDeviceWearer = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  firstName: 'test',
  lastName: 'tester',
  alias: 'tes',
  dateOfBirth: '2000-01-01T00:00:00Z',
  adultAtTimeOfInstallation: true,
  sex: 'FEMALE',
  gender: 'PREFER_TO_SELF_DESCRIBE',
  disabilities: 'OTHER',
  otherDisability: 'Broken arm',
  noFixedAbode: true,
  interpreterRequired: false,
}

context('About the device wearer', () => {
  context('Device wearer', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.signIn()
      })

      it('should correctly display the page', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            deviceWearer: mockDeviceWearer,
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        // Should show the header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Should indicate the page is submitted
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')

        // Should display the saved data
        page.form.firstNamesField.shouldHaveValue('test')
        page.form.lastNameField.shouldHaveValue('tester')
        page.form.aliasField.shouldHaveValue('tes')
        page.form.dateOfBirthField.shouldHaveValue(new Date(2000, 0, 1))
        page.form.responsibleAdultRequiredField.shouldHaveValue('No')
        page.form.sexField.shouldHaveValue('Female')
        page.form.genderIdentityField.shouldHaveValue('Self identify')
        page.form.disabilityField.shouldHaveValue('The device wearer has a disability or health condition not listed')
        page.form.otherDisabilityField.shouldHaveValue('Broken arm')
        page.form.interpreterRequiredField.shouldHaveValue('No')
        page.form.languageField.shouldHaveValue('')

        // Should have the correct buttons
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.backToSummaryButton.should('exist').should('have.attr', 'href', '#')

        // Should not be editable
        page.form.shouldBeDisabled()

        // Should not have errors
        page.errorSummary.shouldNotExist()
      })

      it('should correctly display the gender when Male was selected', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            deviceWearer: {
              ...mockDeviceWearer,
              gender: 'MALE',
            },
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.genderIdentityField.shouldHaveValue('Male')
      })

      it('should correctly display the gender when Female was selected', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            deviceWearer: {
              ...mockDeviceWearer,
              gender: 'FEMALE',
            },
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.genderIdentityField.shouldHaveValue('Female')
      })

      it('should correctly display the gender when Non binary was selected', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            deviceWearer: {
              ...mockDeviceWearer,
              gender: 'NON_BINARY',
            },
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.genderIdentityField.shouldHaveValue('Non binary')
      })

      it('should correctly display the gender when not able to provide this information was selected', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            deviceWearer: {
              ...mockDeviceWearer,
              gender: 'NOT_ABLE_TO_PROVIDE_THIS_INFORMATION',
            },
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.genderIdentityField.shouldHaveValue('Not able to provide this information')
      })
    })
  })
})
