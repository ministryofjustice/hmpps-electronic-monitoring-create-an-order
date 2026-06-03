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
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')

        page.form.curfewRadios.shouldHaveOption('Yes')
        page.form.curfewRadios.shouldHaveOption('No')

        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
      })

      it('Should display textarea when I click yes', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })
        page.form.curfewRadios.element.getByLabel('Yes').check()

        cy.get('#conditional-details')
          .should('not.be.hidden')
          .should('contain.text', 'Enter details of what the curfew address boundary should include')
          .should('contain.text', 'For example, access to the patio up to the lawn at the main curfew address.')
      })
      it('Should not display textarea when I click no', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })
        page.form.curfewRadios.element.getByLabel('No').check()

        cy.get('#conditional-details').should('be.hidden')
      })
    })

    context('Viewing a draft order with existing curfew details', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            curfewConditions: {
              startDate: '',
              endDate: '',
              curfewAddress: '',
              curfewAdditionalDetails: 'some additional curfew details',
            },
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

      it('Should allow the user to update the curfew additional details', () => {
        const page = Page.visit(CurfewAdditionalDetailsPage, {
          orderId: mockOrderId,
        })

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')

        page.form.curfewRadios.element.getByLabel('Yes').should('be.checked')
        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')

        cy.get('#conditional-details').should('not.be.hidden').should('contain.text', 'some additional curfew details')
      })
    })
  })
})
