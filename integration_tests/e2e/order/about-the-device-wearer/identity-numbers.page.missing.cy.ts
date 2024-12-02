import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import { NotFoundErrorPage } from '../../../pages/error'

const mockOrderId = uuidv4()
const pagePath = '/about-the-device-wearer/identity-numbers'

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Viewing a non-existent order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 404 })
      })

      it('Should indicate to the user that there was an error', () => {
        cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

        Page.verifyOnPage(NotFoundErrorPage)
      })
    })
  })
})
