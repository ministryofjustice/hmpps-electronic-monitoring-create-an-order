import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import UploadGrantOfBailPage from './uploadGrantOfBailPage'

const mockOrderId = uuidv4()

context('Attachments', () => {
  context('Upload grant of bail document', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should render the upload grant of bail page', () => {
        const page = Page.visit(UploadGrantOfBailPage, { orderId: mockOrderId })

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Form
        page.form.shouldHaveEncType('multipart/form-data')
        page.form.shouldNotBeDisabled()
        page.form.uploadField.shouldHaveLabel('Upload a copy of the Grant of Bail document')
        page.form.uploadField.shouldHaveHint(
          'Upload a scanned copy or photo of the Grant of Bail document. The file must be a PDF and under 10MB in size. For Secretary of state immigration bail cases you do not need to upload a document.',
        )

        // Buttons
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.backButton.should('exist')
        // Accessible
        page.checkIsAccessible()
      })
    })
  })
})
