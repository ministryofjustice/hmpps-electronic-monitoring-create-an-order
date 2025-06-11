import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CurfewAdditionalDetailsPage from '../../../pages/order/monitoring-conditions/curfew-additional-details'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Curfew additional details', () => {
    context('Viewing a draft order with no set curfew additional details', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')

        // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
        // page.form.hasAnotherAddressField.shouldNotExist()
        cy.contains('legend', 'Does the device wearer have another address they will be monitored at?', {
          log: false,
        }).should('not.exist')

        page.form.curfewAdditionalDetails.shouldHaveValue('')

        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
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
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should allow the user to update the installation address details', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')

        cy.contains('legend', 'Does the device wearer have another address they will be monitored at?', {
          log: false,
        }).should('not.exist')

        page.form.curfewAdditionalDetails.shouldHaveValue('installation postcode')
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
      })
    })
  })
})
