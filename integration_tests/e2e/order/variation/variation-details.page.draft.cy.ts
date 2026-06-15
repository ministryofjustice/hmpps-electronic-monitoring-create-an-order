import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import VariationDetailsPage from '../../../pages/order/variation/variationDetails'
import OrderTasksPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const stubOrder = (type: string = 'VARIATION', dataDictionaryVersion: string = 'DDV5') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    type,
    order: { type, dataDictionaryVersion },
  })
}
context('Variation', () => {
  context('Variation Details', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        stubOrder()

        cy.signIn()
      })

      it('Should allow the user to update the variation details', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.variationDetailsAvailableField.element.should('exist')
        page.form.variationDetailsAvailableField.set('Yes')
        page.form.variationDetailsField.element.should('exist')

        page.form.saveAndReturnButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.checkIsAccessible()
      })

      it('Should not show what has changed if type is REVOCATION', () => {
        stubOrder('REVOCATION')
        Page.visit(VariationDetailsPage, { orderId: mockOrderId })
        Page.verifyOnPage(VariationDetailsPage)
        cy.get('form').find('legend').contains('What have you changed in the form?').should('not.exist')
      })
    })
    context('viewing an previous version', () => {
      const mockVersionId = uuidv4()
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetVersion', {
          httpStatus: 200,
          id: mockOrderId,
          versionId: mockVersionId,
          status: 'SUBMITTED',
          order: {
            type: 'VARIATION',
            dataDictionaryVersion: 'DDV5',
          },
        })

        cy.signIn()
      })

      it('navigates correctly back to summary page', () => {
        const page = Page.visit(VariationDetailsPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)

        page.returnBackToFormSectionMenuButton.click()

        Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)
      })
    })
  })
})
