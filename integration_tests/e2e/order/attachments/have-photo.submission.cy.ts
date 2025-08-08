import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import HavePhotoPage from '../../../pages/order/attachments/havePhoto'
import UploadPhotoIdPage from '../../../pages/order/attachments/uploadPhotoId'

const mockOrderId = uuidv4()
const apiPath = '/attachments/have-photo'

context('Attachments', () => {
  context('Have photo', () => {
    context('Selecting a valid answer', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ havePhoto: true }],
        })
        cy.signIn()
      })

      it('Should allow the user to upload a licence', () => {
        const page = Page.visit(HavePhotoPage, { orderId: mockOrderId })

        page.form.havePhotoField.set('Yes')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(UploadPhotoIdPage)

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}/attachments/have-photo`,
          body: {
            havePhoto: true,
          },
        }).should('be.true')
      })
    })
  })
})
