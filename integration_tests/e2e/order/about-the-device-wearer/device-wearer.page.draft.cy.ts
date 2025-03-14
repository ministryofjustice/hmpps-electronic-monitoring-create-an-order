import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Device wearer', () => {
    context('Viewing a draft order with no data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the device wearer', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })

    context('Viewing a draft order with other gender and other disability', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            deviceWearer: {
              nomisId: null,
              pncId: null,
              deliusId: null,
              prisonNumber: null,
              homeOfficeReferenceNumber: null,
              firstName: 'test',
              lastName: 'tester',
              alias: null,
              dateOfBirth: null,
              adultAtTimeOfInstallation: null,
              sex: null,
              gender: 'self-identify',
              otherGender: 'Furby',
              disabilities: 'OTHER',
              otherDisability: 'Broken arm',
              noFixedAbode: null,
              interpreterRequired: null,
            },
          },
        })

        cy.signIn()
      })

      it('Should display the correct inputs', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        page.form.genderIdentityField.shouldHaveValue('Self identify')
        page.form.otherGenderField.shouldHaveValue('Furby')
        page.form.disabilityField.shouldHaveValue('The device wearer has a disability or health condition not listed')
        page.form.otherDisabilityField.shouldHaveValue('Broken arm')
      })
    })
  })
})
