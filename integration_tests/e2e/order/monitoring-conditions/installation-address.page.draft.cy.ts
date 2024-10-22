import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Installation address', () => {
    context('Viewing a draft order with no installation addresses', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the installation address details', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()

        // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
        // page.form.hasAnotherAddressField.shouldNotExist()
        cy.contains('legend', 'Does the device wearer have another address they will be monitored at?', {
          log: false,
        }).should('not.exist')

        page.form.addressLine1Field.shouldHaveValue('')
        page.form.addressLine2Field.shouldHaveValue('')
        page.form.addressLine3Field.shouldHaveValue('')
        page.form.addressLine4Field.shouldHaveValue('')
        page.form.postcodeField.shouldHaveValue('')
        page.backToSummaryButton.should('not.exist')
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.checkIsAccessible()
      })
    })

    context('Viewing a draft order with an existing installation addresses', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            addresses: [
              {
                addressType: 'INSTALLATION',
                addressLine1: 'installation line 1',
                addressLine2: 'installation line 2',
                addressLine3: 'installation line 3',
                addressLine4: 'installation line 4',
                postcode: 'installation postcode',
              },
            ],
          },
        })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the installation address details', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()

        // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
        // page.form.hasAnotherAddressField.shouldNotExist()
        cy.contains('legend', 'Does the device wearer have another address they will be monitored at?', {
          log: false,
        }).should('not.exist')

        page.form.addressLine1Field.shouldHaveValue('installation line 1')
        page.form.addressLine2Field.shouldHaveValue('installation line 2')
        page.form.addressLine3Field.shouldHaveValue('installation line 3')
        page.form.addressLine4Field.shouldHaveValue('installation line 4')
        page.form.postcodeField.shouldHaveValue('installation postcode')
        page.backToSummaryButton.should('not.exist')
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.checkIsAccessible()
      })
    })
  })
})
