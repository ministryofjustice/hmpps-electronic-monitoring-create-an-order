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

      it('Should display contents', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.checkIsAccessible()
        page.form.shouldHaveAllOptions()
      })
    })

    context('Viewing a draft order with other disability', () => {
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
              gender: 'PREFER_TO_SELF_DESCRIBE',
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
        page.form.disabilityField.shouldHaveValue('The device wearer has a disability or health condition not listed')
        page.form.otherDisabilityField.shouldHaveValue('Broken arm')
      })
    })
  })
})
