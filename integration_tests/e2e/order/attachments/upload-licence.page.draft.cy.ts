import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import UploadLicencePage from '../../../pages/order/attachments/uploadLicence'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Upload licence', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the upload licence page', () => {
        const page = Page.visit(UploadLicencePage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Form
        page.form.shouldHaveEncType('multipart/form-data')
        page.form.shouldNotBeDisabled()

        // Buttons
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')
        page.backToSummaryButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(UploadLicencePage, { orderId: mockOrderId })
        page.checkIsAccessible()
      })
    })
  })
})
