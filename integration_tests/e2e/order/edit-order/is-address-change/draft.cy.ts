import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import IsAddressChangePage from './isAddressChangePage'
import mockApiOrder from '../../../../utils/data/ApiOrder'

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Address change', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          monitoringConditions: {
            ...mockApiOrder().monitoringConditions,
            startDate: '2000-01-01T00:00:00.000Z',
          },
        },
      })

      cy.signIn()
    })

    it('Should display content', () => {
      const page = Page.visit(IsAddressChangePage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.isAddressChangeField.shouldExist()
      page.form.isAddressChangeField.shouldNotBeDisabled()
      page.form.isAddressChangeField.shouldHaveOption('Yes')
      page.form.isAddressChangeField.shouldHaveOption('No')

      page.form.saveAndContinueButton.should('exist')
      page.form.backButton.should('exist')
      page.checkIsAccessible()
    })
  })
})
