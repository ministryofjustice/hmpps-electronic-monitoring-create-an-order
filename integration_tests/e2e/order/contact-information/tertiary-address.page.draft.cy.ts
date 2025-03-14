import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import TertiaryAddressPage from '../../../pages/order/contact-information/tertiary-adddress'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Tertiary address', () => {
    context('Viewing a draft order with no addresses', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the tertiary address details', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
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
        page.errorSummary.shouldNotExist()
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.checkIsAccessible()
      })
    })

    context('Viewing a draft order with primary, secondary and tertiary addresses', () => {
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
                addressType: 'PRIMARY',
                addressLine1: 'primary line 1',
                addressLine2: 'primary line 2',
                addressLine3: 'primary line 3',
                addressLine4: 'primary line 4',
                postcode: 'primary postcode',
              },
              {
                addressType: 'SECONDARY',
                addressLine1: 'secondary line 1',
                addressLine2: 'secondary line 2',
                addressLine3: 'secondary line 3',
                addressLine4: 'secondary line 4',
                postcode: 'secondary postcode',
              },
              {
                addressType: 'TERTIARY',
                addressLine1: 'tertiary line 1',
                addressLine2: 'tertiary line 2',
                addressLine3: 'tertiary line 3',
                addressLine4: 'tertiary line 4',
                postcode: 'tertiary postcode',
              },
            ],
          },
        })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the tertiary address details', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()

        // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
        // page.form.hasAnotherAddressField.shouldNotExist()
        cy.contains('legend', 'Does the device wearer have another address they will be monitored at?', {
          log: false,
        }).should('not.exist')

        page.form.addressLine1Field.shouldHaveValue('tertiary line 1')
        page.form.addressLine2Field.shouldHaveValue('tertiary line 2')
        page.form.addressLine3Field.shouldHaveValue('tertiary line 3')
        page.form.addressLine4Field.shouldHaveValue('tertiary line 4')
        page.form.postcodeField.shouldHaveValue('tertiary postcode')
        page.backToSummaryButton.should('not.exist')
        page.errorSummary.shouldNotExist()
      })

      // TODO: FAIL issue determining if autocomplete is valid
      it.skip('Should be accessible', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.checkIsAccessible()
      })
    })
  })
})
