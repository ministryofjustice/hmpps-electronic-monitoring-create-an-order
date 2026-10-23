import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import OrderTasksPage from '../../../../pages/order/summary'
import AttachmentSummaryPage from '../../../../pages/order/attachments/summary'
import NewDocumentPage from '../../../../pages/order/attachments/newDocument'
import UploadLicencePage from '../../../../pages/order/attachments/uploadLicence'

const mockOrderId = uuidv4()
const PAST_START_DATE = '2025-01-01T00:00:00.000Z'
const FUTURE_START_DATE = '2040-01-01T00:00:00.000Z'

const stubProbationVariation = (startDate: string) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    type: 'VARIATION',
    order: {
      interestedParties: {
        notifyingOrganisation: 'PROBATION',
        notifyingOrganisationName: 'NORTH_EAST',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOfficerFirstName: 'John',
        responsibleOfficerLastName: 'Smith',
        responsibleOfficerEmail: 'officer@email',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: '',
        responsibleOrganisationRegion: 'NORTH_EAST',
      },
      monitoringConditions: {
        orderType: null,
        curfew: null,
        exclusionZone: null,
        trail: null,
        mandatoryAttendance: null,
        alcohol: null,
        orderTypeDescription: null,
        conditionType: null,
        startDate,
        endDate: null,
        sentenceType: null,
        issp: null,
        hdc: null,
        prarr: null,
        pilot: null,
        dapolMissedInError: null,
        offenceType: null,
        isValid: false,
      },
      orderParameters: { havePhoto: false, haveLicence: null },
      additionalDocuments: [],
    },
  })
}

context('Attachments', () => {
  context('Probation change to an order that has already started', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOrderId })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/attachments/file-required',
        response: {},
      })
    })

    it('asks whether a new document is needed from the task list', () => {
      stubProbationVariation(PAST_START_DATE)
      cy.signIn()

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments/new-document`)
    })

    it('asks whether a new document is needed on the question page', () => {
      stubProbationVariation(PAST_START_DATE)
      cy.signIn()

      const page = Page.visit(NewDocumentPage, { orderId: mockOrderId })

      page.form.needNewDocumentField.shouldNotBeDisabled()
      page.form.needNewDocumentField.shouldHaveOption('Yes')
      page.form.needNewDocumentField.shouldHaveOption('No')
      page.checkIsAccessible()
    })

    it('asks the user to choose when no answer is given', () => {
      stubProbationVariation(PAST_START_DATE)
      cy.signIn()

      const page = Page.visit(NewDocumentPage, { orderId: mockOrderId })
      page.form.saveAndContinueButton.click()

      page.errorSummary.shouldExist()
      page.errorSummary.shouldHaveError('Select Yes if you need to upload a new document')
      page.form.needNewDocumentField.validationMessage.contains('Select Yes if you need to upload a new document')
    })

    it('goes to the upload page when a new document is needed', () => {
      stubProbationVariation(PAST_START_DATE)
      cy.signIn()

      const page = Page.visit(NewDocumentPage, { orderId: mockOrderId })
      page.form.needNewDocumentField.set('Yes')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/attachments/file-required`,
        body: { fileType: 'LICENCE', fileRequired: true },
      }).should('be.true')
      Page.verifyOnPage(UploadLicencePage)
    })

    it('goes to check answers when no new document is needed', () => {
      stubProbationVariation(PAST_START_DATE)
      cy.signIn()

      const page = Page.visit(NewDocumentPage, { orderId: mockOrderId })
      page.form.needNewDocumentField.set('No')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/attachments/file-required`,
        body: { fileType: 'LICENCE', fileRequired: false },
      }).should('be.true')
      Page.verifyOnPage(AttachmentSummaryPage)
    })

    it('keeps the licence upload when the order has not started yet', () => {
      stubProbationVariation(FUTURE_START_DATE)
      cy.signIn()

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence`)
    })
  })
})
