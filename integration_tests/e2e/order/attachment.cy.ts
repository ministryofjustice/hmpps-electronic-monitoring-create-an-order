import { v4 as uuidv4 } from 'uuid'
import ErrorPage from '../../pages/error'
import Page from '../../pages/page'
import AttachmentPage from '../../pages/order/attachment'
import AttachmentUploadPage from '../../pages/order/attachmentUpload'

const mockOrderId = uuidv4()
const mockOrderIdWithAttachments = uuidv4()
context('Attachment', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrderWithAttachments', {
        httpStatus: 200,
        id: mockOrderIdWithAttachments,
        status: 'IN_PROGRESS',
        attachments: [
          { id: mockOrderId, orderId: mockOrderId, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
          { id: mockOrderId, orderId: mockOrderId, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
        ],
      })
    })

    it('Should display the user name visible in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      const page = Page.verifyOnPage(AttachmentPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      const page = Page.verifyOnPage(AttachmentPage)
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render summary pages', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get('.govuk-summary-list__key').contains('Licence').should('exist')
      cy.get('.govuk-summary-list__value').contains('No licence document uploaded').should('exist')
      cy.get('.govuk-summary-list__key').contains('Photo ID').should('exist')
      cy.get('.govuk-summary-list__value').contains('No photo id document uploaded').should('exist')
      cy.get('a:contains("Change")').should('have.length', 2)
    })

    it('Should render summary page with download links', () => {
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get('.govuk-summary-list__key').contains('Licence').should('exist')
      cy.get('.govuk-summary-list__value')
        .contains('Licence.jpeg')
        .should('exist')
        .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence/Licence.jpeg`)
      cy.get('.govuk-summary-list__key').contains('Photo ID').should('exist')
      cy.get('.govuk-summary-list__value')
        .contains('photo.jpeg')
        .should('exist')
        .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photoId/photo.jpeg`)
      cy.get('a:contains("Change")').should('have.length', 2)
    })

    it('Should be accessible', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      const page = Page.verifyOnPage(AttachmentPage)
      page.checkIsAccessible()
    })
  })

  context('Upload pages', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should render upload licence page', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/licence"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)
      uploadPage.saveAndContinueButton().should('exist')
      cy.get(`[href="/order/${mockOrderId}/attachments"]`).should('exist')

      cy.get('.govuk-label').contains('Upload the licence').should('exist')
      cy.get('.govuk-hint').contains('Upload a copy of the licence').should('exist')

      cy.get('.govuk-file-upload').should('exist')
    })

    it('Upload licence failed, display error', () => {
      cy.task('stubUploadAttachment', { httpStatus: 400, id: mockOrderId, type: 'LICENCE' })
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/licence"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)

      cy.get('.govuk-file-upload').should('exist')
      uploadPage.uploadFile()
      uploadPage.saveAndContinueButton().click()
      cy.get('#licence-error').contains('Mock Error').should('exist')
    })

    it('Upload licence successful, return to summary page', () => {
      cy.task('stubUploadAttachment', { httpStatus: 200, id: mockOrderId, type: 'LICENCE' })
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/licence"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)

      cy.get('.govuk-file-upload').should('exist')
      uploadPage.uploadFile()
      uploadPage.saveAndContinueButton().click()
      Page.verifyOnPage(AttachmentPage)
    })

    it('Upload photo failed, display error', () => {
      cy.task('stubUploadAttachment', { httpStatus: 400, id: mockOrderId, type: 'PHOTO_ID' })
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/photoId"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)

      cy.get('.govuk-file-upload').should('exist')
      uploadPage.uploadFile()
      uploadPage.saveAndContinueButton().click()
      cy.get('#licence-error').contains('Mock Error').should('exist')
    })

    it('Upload photo successful, return to summary page', () => {
      cy.task('stubUploadAttachment', { httpStatus: 200, id: mockOrderId, type: 'PHOTO_ID' })
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/photoId"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)

      cy.get('.govuk-file-upload').should('exist')
      uploadPage.uploadFile()
      uploadPage.saveAndContinueButton().click()
      Page.verifyOnPage(AttachmentPage)
    })

    it('Should render upload photo page', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`)
      Page.verifyOnPage(AttachmentPage)

      cy.get(`[href="/order/${mockOrderId}/attachments/photoId"]`).click()
      const uploadPage = Page.verifyOnPage(AttachmentUploadPage)
      uploadPage.saveAndContinueButton().should('exist')
      cy.get(`[href="/order/${mockOrderId}/attachments"]`).should('exist')

      cy.get('.govuk-label').contains('Upload the photo id').should('exist')
      cy.get('.govuk-hint').contains('Upload a copy of the photo id').should('exist')

      cy.get('.govuk-file-upload').should('exist')
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/attachments`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
