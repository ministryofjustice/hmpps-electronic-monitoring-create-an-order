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
      cy.get('.govuk-summary-list__value').contains('No photo ID document uploaded').should('exist')
      cy.get('a:contains("Add")').should('have.length', 2)
    })

    it('Should render summary page with download links and delete links', () => {
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
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/licence/delete"]`).should('exist')
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/photoId/delete"]`).should('exist')
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
      cy.get('#file-to-upload-error').contains('Mock Error').should('exist')
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
      cy.get('#file-to-upload-error').contains('Mock Error').should('exist')
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

  context('Delete attachment', () => {
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
    it('Should render delete confirmation page', () => {
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/licence/delete"]`).click()
      cy.get('h1').contains('Are you sure you want to delete this licence?')
      cy.get('button').contains('Delete').should('exist')
      cy.get('button').contains('Back').should('exist')
    })

    it('Should redirect summary view and display error after failed to delete licence', () => {
      cy.task('stubDeleteAttachment', { httpStatus: 500, id: mockOrderIdWithAttachments, type: 'LICENCE' })
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/licence/delete"]`).click()
      cy.get('button').contains('Delete').click()
      cy.get('.govuk-error-summary__title').contains('Error deleting attachment').should('exist')
      cy.get('.govuk-error-summary__list').get('li').contains('Mock Error').should('exist')
      Page.verifyOnPage(AttachmentPage)
    })

    it('Should redirect summary view after confirm delete', () => {
      cy.task('stubDeleteAttachment', { httpStatus: 200, id: mockOrderIdWithAttachments, type: 'LICENCE' })
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/licence/delete"]`).click()
      cy.get('button').contains('Delete').click()

      cy.task('getStubbedRequest', `/orders/${mockOrderIdWithAttachments}/document-type/LICENCE`).then(requests => {
        expect(requests).to.have.lengthOf(1)
      })
      Page.verifyOnPage(AttachmentPage)
    })

    it('Should redirect summary view and display error after failed to delete photoId', () => {
      cy.task('stubDeleteAttachment', { httpStatus: 500, id: mockOrderIdWithAttachments, type: 'PHOTO_ID' })
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/photoId/delete"]`).click()
      cy.get('button').contains('Delete').click()
      cy.get('.govuk-error-summary__title').contains('Error deleting attachment').should('exist')
      cy.get('.govuk-error-summary__list').get('li').contains('Mock Error').should('exist')
      Page.verifyOnPage(AttachmentPage)
    })

    it('Should delete photo id after confirm delete', () => {
      cy.task('stubDeleteAttachment', { httpStatus: 200, id: mockOrderIdWithAttachments, type: 'PHOTO_ID' })
      cy.signIn().visit(`/order/${mockOrderIdWithAttachments}/attachments`)
      Page.verifyOnPage(AttachmentPage)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/photoId/delete"]`).click()
      cy.get('button').contains('Delete').click()

      cy.task('getStubbedRequest', `/orders/${mockOrderIdWithAttachments}/document-type/PHOTO_ID`).then(requests => {
        expect(requests).to.have.lengthOf(1)
      })
      Page.verifyOnPage(AttachmentPage)
    })
  })

  context('Submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrderWithAttachments', {
        httpStatus: 200,
        id: mockOrderIdWithAttachments,
        status: 'SUBMITTED',
        attachments: [
          { id: mockOrderId, orderId: mockOrderId, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
          { id: mockOrderId, orderId: mockOrderId, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
        ],
      })
    })

    it('Should render summary page with no download links and no delete links', () => {
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
      cy.get('a:contains("Change")').should('have.length', 0)
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/licence/delete"]`).should('not.exist')
      cy.get(`[href="/order/${mockOrderIdWithAttachments}/attachments/photoId/delete"]`).should('not.exist')
    })
  })
})
