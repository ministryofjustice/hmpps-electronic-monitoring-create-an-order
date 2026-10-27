import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import OrderTasksPage from '../../../pages/order/summary'
import { FUTURE_START_DATE, probationChangeOrderStub } from '../../../utils/data/probationChangeOrder'

const mockOrderId = uuidv4()
const mockOrderIdWithAttachments = uuidv4()
const mockOrderIdForCourt = uuidv4()

context('Attachments', () => {
  context('Summary', () => {
    context('Viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoGetOrderWithAttachments', {
          httpStatus: 200,
          id: mockOrderIdWithAttachments,
          status: 'IN_PROGRESS',
          attachments: [
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
          ],
          orderParameters: {
            havePhoto: true,
          },
        })
        cy.signIn()
      })

      it('Should render the attachment summary page for a new draft order', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'Check your answers')

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: '' },
          { key: 'Do you have a photo to upload?', value: 'No' },
        ])

        page.changeLinks.should('exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
      })

      it('Should render the attachment summary page for a draft order with uploaded attachments', () => {
        const page = Page.visit(
          AttachmentSummaryPage,
          { orderId: mockOrderIdWithAttachments },
          {},
          'Check your answers',
        )

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: 'Licence.jpeg' },
          { key: 'Do you have a photo to upload?', value: 'Yes' },
          { key: 'Upload a photo of the device wearer', value: 'photo.jpeg' },
        ])
        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('Licence.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/licence/Licence.jpeg`)

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('photo.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderIdWithAttachments}/attachments/photo_Id/photo.jpeg`)

        page.changeLinks.should('exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
        page.backButton.should('exist')
      })

      it('Should be accessible', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, 'Check your answers')
        page.checkIsAccessible()
      })
    })

    context('Viewing a probation change to an order that has already started', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOrderId })
      })

      it('shows that no new document is needed', () => {
        cy.task('stubCemoGetOrder', probationChangeOrderStub({ id: mockOrderId, haveLicence: false }))
        cy.signIn()

        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        page.attachmentsSection.shouldHaveItems([
          { key: 'Do you need to upload a new document?', value: 'No' },
          { key: 'Do you have a photo to upload?', value: 'No' },
        ])
        page.attachmentsSection.shouldNotHaveItem('Upload a copy of the licence or court order document')
        page.attachmentsSection.element
          .contains('.govuk-summary-list__row', 'Do you need to upload a new document?')
          .find('a')
          .should('have.attr', 'href', `/order/${mockOrderId}/attachments/new-document`)
      })

      it('shows the uploaded licence when a new document is needed', () => {
        cy.task(
          'stubCemoGetOrder',
          probationChangeOrderStub({ id: mockOrderId, haveLicence: true, licenceFileName: 'new-licence.pdf' }),
        )
        cy.signIn()

        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        page.attachmentsSection.shouldHaveItems([
          { key: 'Do you need to upload a new document?', value: 'Yes' },
          { key: 'Upload a copy of the licence or court order document', value: 'new-licence.pdf' },
          { key: 'Do you have a photo to upload?', value: 'No' },
        ])
      })

      it('shows the uploaded recall document for a revocation', () => {
        cy.task(
          'stubCemoGetOrder',
          probationChangeOrderStub({
            id: mockOrderId,
            type: 'REVOCATION',
            haveLicence: true,
            licenceFileName: 'recall.pdf',
          }),
        )
        cy.signIn()

        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        page.attachmentsSection.shouldHaveItems([
          { key: 'Do you need to upload a new document?', value: 'Yes' },
          { key: 'Upload a copy of the recall document', value: 'recall.pdf' },
        ])
      })

      it('shows only the licence when the order has not started yet', () => {
        cy.task(
          'stubCemoGetOrder',
          probationChangeOrderStub({ id: mockOrderId, startDate: FUTURE_START_DATE, licenceFileName: 'licence.pdf' }),
        )
        cy.signIn()

        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId })

        page.attachmentsSection.shouldHaveItems([
          { key: 'Upload a copy of the licence or court order document', value: 'licence.pdf' },
        ])
        page.attachmentsSection.shouldNotHaveItem('Do you need to upload a new document?')
      })
    })

    context('court cohort, viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')

        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
          stubCohort: false,
          userId: '123',
        })

        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: 'user-cohort',
          response: { cohort: 'COURT' },
        })

        cy.task('stubCemoListOrders')

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderIdForCourt,
          status: 'IN_PROGRESS',
          order: {
            interestedParties: {
              notifyingOrganisation: 'FAMILY_COURT',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: '',
              responsibleOfficerName: '',
              responsibleOfficerPhoneNumber: '',
              responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
              responsibleOrganisationAddress: {
                addressType: 'RESPONSIBLE_ORGANISATION',
                addressLine1: '',
                addressLine2: '',
                addressLine3: '',
                addressLine4: '',
                postcode: '',
              },
              responsibleOrganisationEmail: '',
              responsibleOrganisationPhoneNumber: '',
              responsibleOrganisationRegion: '',
            },
            additionalDocuments: [
              { id: uuidv4(), orderId: mockOrderIdForCourt, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
            ],
            orderParameters: {
              havePhoto: true,
            },
          },
        })

        cy.signIn()
      })

      it('Should render the attachment summary page for a draft order with uploaded attachments', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderIdForCourt }, {}, 'Check your answers')

        // Header
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        // Attachments
        page.attachmentsSection.shouldHaveItems([
          { key: 'Do you have a photo to upload?', value: 'Yes' },
          { key: 'Upload a photo of the device wearer', value: 'photo.jpeg' },
        ])

        page.attachmentsSection.shouldNotHaveItem('Do you have a court order document to upload?')

        page.attachmentsSection.element
          .find('.govuk-summary-list__value')
          .contains('photo.jpeg')
          .should('have.attr', 'href', `/order/${mockOrderIdForCourt}/attachments/photo_Id/photo.jpeg`)

        page.changeLinks.should('exist')

        // Buttons
        page.saveAndReturnButton.should('exist')
        page.backButton.should('exist')
      })
    })

    context('viewing a previous version', () => {
      const mockVersionId = uuidv4()
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetVersion', {
          httpStatus: 200,
          id: mockOrderId,
          versionId: mockVersionId,
          status: 'IN_PROGRESS',
        })
        cy.task('stubCemoGetVersionWithAttachments', {
          httpStatus: 200,
          id: mockOrderIdWithAttachments,
          status: 'IN_PROGRESS',
          versionId: mockVersionId,
          attachments: [
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'Licence.jpeg', fileType: 'LICENCE' },
            { id: uuidv4(), orderId: mockOrderIdWithAttachments, fileName: 'photo.jpeg', fileType: 'PHOTO_ID' },
          ],
          orderParameters: {
            havePhoto: true,
          },
        })
        cy.signIn()
      })
      it('navigates correctly back to summary page', () => {
        const page = Page.visit(
          AttachmentSummaryPage,
          { orderId: mockOrderId, versionId: mockVersionId },
          {},
          'Check your answers',
          true,
        )

        page.saveAndReturnButton.click()

        Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)
      })
    })

    context('view only version', () => {
      const mockVersionId = uuidv4()
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          versionId: mockVersionId,
          status: 'IN_PROGRESS',
          order: {
            isOwner: false,
          },
        })

        cy.signIn()
      })

      const pageHeading = 'Check your answers'

      it('no change links', () => {
        const page = Page.visit(AttachmentSummaryPage, { orderId: mockOrderId }, {}, pageHeading, false)
        page.changeLinks.should('not.exist')
        page.continueButton().should('not.exist')
      })
    })
  })
})
