import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import paths from '../../../../server/constants/paths'
import versionInformation from './summary-helpers'

const mockOrderId = uuidv4()

type StatusUpdateStub = {
  orderVersionId: string
  orderVersionType: string
  status: string
  datetimeOfStatusChange: string
  statusUpdatedBy?: string | null
  reasons?: { section: string; details: string | null }[]
}

const statusUpdate = (stub: StatusUpdateStub) => ({
  id: uuidv4(),
  orderId: mockOrderId,
  statusUpdatedBy: null,
  reasons: [],
  ...stub,
})

const stubStatusUpdates = (statusUpdates: ReturnType<typeof statusUpdate>[]) =>
  cy.task('stubCemoGetStatusUpdates', { httpStatus: 200, orderId: mockOrderId, statusUpdates })

// Timeline items are rendered newest first
const expectTimelineTitles = (titles: string[]) => {
  cy.get('.moj-timeline__item').should('have.length', titles.length)
  titles.forEach((title, index) => {
    cy.get('.moj-timeline__item').eq(index).find('.moj-timeline__title').should('contain.text', title)
  })
}

const timelineItem = (index: number) => cy.get('.moj-timeline__item').eq(index)

context('Order Summary timeline', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
  })

  context('single order version', () => {
    const versionId = uuidv4()
    const version = versionInformation({
      versionId,
      submittedBy: 'Person One',
      fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
    })

    const stubOrder = (status: string) => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status,
        order: { id: mockOrderId, versionId, status },
      })
      cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [version], orderId: mockOrderId })
    }

    it('shows only the latest item for CREATED and SUBMITTED status updates', () => {
      stubOrder('SUBMITTED')
      stubStatusUpdates([
        statusUpdate({
          orderVersionId: versionId,
          orderVersionType: 'REQUEST',
          status: 'CREATED',
          datetimeOfStatusChange: '2025-01-01T09:00:00Z',
          statusUpdatedBy: 'Person One',
        }),
        statusUpdate({
          orderVersionId: versionId,
          orderVersionType: 'REQUEST',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2025-01-01T10:30:00Z',
          statusUpdatedBy: 'Person One',
        }),
      ])
      cy.signIn()

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      expectTimelineTitles(['Form submitted'])
      timelineItem(0).should('contain.text', '1 January 2025 at 10:30am').and('contain.text', 'Person One')
      timelineItem(0).should('contain.text', 'You are viewing this version of the form')
    })

    it('shows only the latest item for CREATED and SUBMISSION_FAILED status updates', () => {
      stubOrder('ERROR')
      stubStatusUpdates([
        statusUpdate({
          orderVersionId: versionId,
          orderVersionType: 'REQUEST',
          status: 'CREATED',
          datetimeOfStatusChange: '2025-01-01T09:00:00Z',
          statusUpdatedBy: 'Person One',
        }),
        statusUpdate({
          orderVersionId: versionId,
          orderVersionType: 'REQUEST',
          status: 'SUBMISSION_FAILED',
          datetimeOfStatusChange: '2025-01-01T10:30:00Z',
          statusUpdatedBy: 'Person One',
        }),
      ])
      cy.signIn()

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      expectTimelineTitles(['Failed to submit'])
      timelineItem(0).should('contain.text', 'You are viewing this version of the form')
    })
  })

  context('multiple order versions', () => {
    const versionOneId = uuidv4()
    const versionTwoId = uuidv4()
    const versionThreeId = uuidv4()

    beforeEach(() => {
      const versions = [
        {
          ...versionInformation({
            versionId: versionThreeId,
            type: 'VARIATION',
            status: 'IN_PROGRESS',
            submittedBy: null,
            lastUpdatedBy: 'Person Two',
            fmsResultDate: null,
            lastUpdatedDateTime: new Date(2025, 0, 5, 9, 0, 0, 0).toISOString(),
          }),
          versionNumber: 2,
        },
        {
          ...versionInformation({
            versionId: versionTwoId,
            type: 'VARIATION',
            submittedBy: 'Person Two',
            fmsResultDate: new Date(2025, 0, 3, 10, 30, 0, 0).toISOString(),
          }),
          versionNumber: 1,
        },
        {
          ...versionInformation({
            versionId: versionOneId,
            submittedBy: 'Person One',
            fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
          }),
          versionNumber: 0,
        },
      ]

      // Viewing the first version so the page is read only and the timeline is displayed
      cy.task('stubCemoGetVersion', {
        httpStatus: 200,
        id: mockOrderId,
        versionId: versionOneId,
        order: { id: mockOrderId, versionId: versionOneId, status: 'SUBMITTED', type: 'REQUEST' },
      })
      cy.task('stubCemoGetVersions', { httpStatus: 200, versions, orderId: mockOrderId })
      stubStatusUpdates([
        statusUpdate({
          orderVersionId: versionOneId,
          orderVersionType: 'REQUEST',
          status: 'CREATED',
          datetimeOfStatusChange: '2025-01-01T09:00:00Z',
          statusUpdatedBy: 'Person One',
        }),
        statusUpdate({
          orderVersionId: versionOneId,
          orderVersionType: 'REQUEST',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2025-01-01T10:30:00Z',
          statusUpdatedBy: 'Person One',
        }),
        statusUpdate({
          orderVersionId: versionOneId,
          orderVersionType: 'REQUEST',
          status: 'REJECTED',
          datetimeOfStatusChange: '2025-01-02T12:00:00Z',
        }),
        statusUpdate({
          orderVersionId: versionTwoId,
          orderVersionType: 'VARIATION',
          status: 'VERSION_CREATED',
          datetimeOfStatusChange: '2025-01-03T09:00:00Z',
          statusUpdatedBy: 'Person Two',
        }),
        statusUpdate({
          orderVersionId: versionTwoId,
          orderVersionType: 'VARIATION',
          status: 'SUBMITTED',
          datetimeOfStatusChange: '2025-01-03T10:30:00Z',
          statusUpdatedBy: 'Person Two',
        }),
        statusUpdate({
          orderVersionId: versionTwoId,
          orderVersionType: 'VARIATION',
          status: 'ACCEPTED',
          datetimeOfStatusChange: '2025-01-04T12:00:00Z',
        }),
        statusUpdate({
          orderVersionId: versionThreeId,
          orderVersionType: 'VARIATION',
          status: 'VERSION_CREATED',
          datetimeOfStatusChange: '2025-01-05T09:00:00Z',
          statusUpdatedBy: 'Person Two',
        }),
      ])
      cy.signIn()
    })

    it('shows only the latest status update of each version, newest first', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: mockOrderId,
          versionId: versionThreeId,
          status: 'IN_PROGRESS',
          owner: 'Person Two',
          isOwner: false,
        },
      })
      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      expectTimelineTitles(['Version Created', 'Form accepted', 'Form returned'])
      timelineItem(0).should('contain.text', '5 January 2025 at 9am').and('contain.text', 'Person Two')
      timelineItem(1).should('contain.text', '4 January 2025 at 12pm')
      timelineItem(1).should('contain.text', 'The Electronic Monitoring Service (EMS)')
      timelineItem(2).should('contain.text', '2 January 2025 at 12pm')
      timelineItem(2).should('contain.text', 'The Electronic Monitoring Service (EMS)')
    })

    it('links every version that is not the current version', () => {
      Page.visit(OrderTasksPage, { orderId: mockOrderId, versionId: versionOneId }, {}, true)

      const versionLink = (versionId: string) =>
        paths.ORDER.SUMMARY_VERSION.replace(':orderId', mockOrderId).replace(':versionId', versionId)

      timelineItem(0).contains('a', 'View this form').should('have.attr', 'href', versionLink(versionThreeId))
      timelineItem(1).contains('a', 'View this form').should('have.attr', 'href', versionLink(versionTwoId))
      timelineItem(2).find('a').should('not.exist')
    })

    it('shows that the current version is being viewed only on its item', () => {
      Page.visit(OrderTasksPage, { orderId: mockOrderId, versionId: versionOneId }, {}, true)

      timelineItem(2).should('contain.text', 'You are viewing this version of the form')
      cy.get('.moj-timeline p:contains("You are viewing this version of the form")').should('have.length', 1)
    })
  })
})
