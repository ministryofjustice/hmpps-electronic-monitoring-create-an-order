import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import IsMappaPage from './IsMappaPage'

const mockOrderId = uuidv4()

context('is mappa page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'SUBMITTED',
      order: {
        mappa: {
          level: 'MAPPA_ONE',
          category: 'CATEGORY_ONE',
          isMappa: 'YES',
        },
      },
    })

    cy.signIn()
  })

  it('can view a submitted order', () => {
    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.isMappaField.shouldBeDisabled()
    page.form.isMappaField.shouldHaveValue('Yes')
  })
})
