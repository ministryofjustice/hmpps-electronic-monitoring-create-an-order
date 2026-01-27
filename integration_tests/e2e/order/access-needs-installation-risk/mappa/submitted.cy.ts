import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import MappaPage from './MappaPage'

const mockOrderId = uuidv4()

context('mappa page', () => {
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
        },
      },
    })

    cy.signIn()
  })

  it('can view a submitted order', () => {
    const page = Page.visit(MappaPage, { orderId: mockOrderId })

    page.form.levelField.shouldBeDisabled()
    page.form.levelField.shouldHaveValue('MAPPA 1')
    page.form.categoryField.shouldBeDisabled()
    page.form.categoryField.shouldHaveValue('Category 1')
  })
})
