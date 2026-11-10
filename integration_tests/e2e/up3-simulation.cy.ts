import mockApiOrder from '../utils/data/ApiOrder'

const orderId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const versionId = '22a22222-79cd-49f9-a498-b1f07c543b8a'
const basePath = `/dev/up3-simulation/orders/${orderId}`
const inspection = {
  orderId,
  currentOrderVersionId: versionId,
  currentOrderVersionNumber: 0,
  simulatedSubmissionVersionId: versionId,
  simulatedSubmissionVersionNumber: 0,
  caseId: `sim-${versionId}`,
  caseState: 'NEW',
  orderStatus: 'SUBMITTED',
  isOwner: true,
  canAmend: false,
  canControlSubmission: true,
  lastProcessedEventId: null,
  capturedUserEmails: 0,
  capturedNoEmails: 0,
}
const stubOrder = (canAmend = false, status = 'SUBMITTED', statusUpdates: object[] = []) =>
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: orderId,
    status,
    type: 'REQUEST',
    order: {
      versionId,
      canAmend,
      statusUpdates,
      monitoringConditions: { ...mockApiOrder().monitoringConditions, startDate: '2000-01-01T00:00:00.000Z' },
    },
  })

const suite = Cypress.env('up3SimulationEnabled') ? describe : describe.skip
suite('Dev UP3 simulation', () => {
  beforeEach(() => {
    cy.task('resetFeatureFlags')
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubUp3Simulation', {
      path: '/availability',
      response: { available: true, code: 'UP3_SIMULATION_AVAILABLE' },
    })
    cy.task('stubUp3Simulation', { path: `/orders/${orderId}`, response: inspection })
    stubOrder()
    cy.signIn()
  })

  it('rejects an ordinary submitted order loaded by GET URL without enrollment controls', () => {
    cy.task('stubUp3Simulation', {
      path: `/orders/${orderId}`,
      status: 404,
      response: { errorCode: 'UP3_SIMULATION_NOT_ENROLLED' },
    })
    cy.visit('/dev/up3-simulation')
    cy.get('#orderId').type(`http://localhost:8080/api/orders/${orderId}`)
    cy.contains('button', 'Inspect order').click()
    cy.contains('This order is not simulated').should('be.visible')
    cy.contains('Enrol order').should('not.exist')
    cy.get('input[name=confirmation]').should('not.exist')
    cy.contains('Set processing').should('not.exist')
    cy.contains('Return order').should('not.exist')
    cy.contains('Start a new creation intent').should('have.attr', 'href', '/dev/up3-simulation/create')
  })

  it('sets accepted with the displayed version and follows the normal summary', () => {
    cy.visit(`/order/${orderId}/summary`)
    cy.get(`a[href="/order/${orderId}/edit"]`).should('not.exist')
    cy.contains('Dev: simulate UP3').click()
    cy.contains('Set accepted').should('be.visible')
    cy.get('input[name=expectedCurrentOrderVersionId]').should('have.value', versionId)
    cy.task('stubUp3Simulation', {
      path: `/orders/${orderId}/state`,
      method: 'PUT',
      response: { ...inspection, caseState: 'AWAITING_VALIDATION', canAmend: true },
    })
    cy.task('stubUp3Simulation', {
      path: `/orders/${orderId}`,
      response: { ...inspection, caseState: 'AWAITING_VALIDATION', canAmend: true },
    })
    stubOrder(true, 'SUBMITTED', [
      {
        id: '33a33333-79cd-49f9-a498-b1f07c543b8a',
        versionId,
        status: 'ACCEPTED',
        datetimeOfStatusChange: '2026-11-05T12:00:00Z',
        statusUpdateReasons: [],
      },
    ])
    cy.contains('button', 'Set accepted').click()
    cy.contains('AWAITING_VALIDATION').should('be.visible')
    cy.contains('Open normal order summary').click()
    cy.get(`a[href="/order/${orderId}/edit"]`).should('be.visible')
    cy.contains('Form accepted').should('be.visible')
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/dev/up3-simulation/orders/${orderId}/state`,
      method: 'PUT',
      body: {
        state: 'ACCEPTED',
        expectedCurrentOrderVersionId: versionId,
        expectedSimulatedSubmissionVersionId: versionId,
      },
    }).should('be.true')
  })

  it('tracks a queued return to processing success and renders reasons and timeline in the normal UI', () => {
    cy.viewport(390, 844)
    cy.visit(`${basePath}/return`)
    cy.get('input[name=eventId]')
      .invoke('val')
      .then(eventId => {
        const receipt = {
          eventId,
          orderId,
          targetOrderVersionId: versionId,
          simulatedSubmissionVersionId: versionId,
          status: 'QUEUED',
          createdAt: '2026-11-05T12:00:00Z',
          queuedAt: null,
          completedAt: null,
          publicationAttempts: 1,
          processingFailures: 0,
          nextPublicationAttemptAt: null,
          failureStage: null,
          errorCode: null,
        }
        cy.task('stubUp3Simulation', {
          path: `/orders/${orderId}/return`,
          method: 'POST',
          status: 202,
          response: receipt,
        })
        cy.task('stubUp3Simulation', { path: `/orders/${orderId}/returns/${eventId}`, response: receipt })
        cy.get('#section-0').type('other')
        cy.get('#details-0').type('Missing signature')
        cy.contains('button', 'Publish return').click()
        cy.contains('Return queued; awaiting processing.').should('be.visible')
        cy.contains('Return processed.').should('not.exist')
        cy.task('stubUp3Simulation', {
          path: `/orders/${orderId}/returns/${eventId}`,
          response: { ...receipt, status: 'PROCESSED' },
        })
        stubOrder(true, 'REJECTED', [
          {
            id: '33a33333-79cd-49f9-a498-b1f07c543b8a',
            versionId,
            status: 'REJECTED',
            datetimeOfStatusChange: '2026-11-05T12:00:00Z',
            statusUpdateReasons: [
              {
                id: '44a44444-79cd-49f9-a498-b1f07c543b8a',
                statusUpdateId: '33a33333-79cd-49f9-a498-b1f07c543b8a',
                section: 'other',
                details: 'Missing signature',
              },
            ],
          },
        ])
        cy.contains('Refresh this event').click()
        cy.contains('Return processed.').should('be.visible')
        cy.contains('Open normal order summary').click()
        cy.contains('This form has been returned.').should('be.visible')
        cy.contains('Form returned').should('be.visible')
        cy.get(`a[href="/order/${orderId}/return-reasons"]`).click()
        cy.contains('Missing signature').should('be.visible')
      })
  })

  it('creates a draft using a preallocated identity without submission controls', () => {
    cy.visit('/dev/up3-simulation/create')
    cy.get('input[name=creationRequestId]')
      .invoke('val')
      .then(creationRequestId => {
        cy.task('stubUp3Simulation', {
          path: '/orders',
          method: 'POST',
          status: 201,
          response: {
            creationRequestId,
            createdOrderVersionId: versionId,
            requestedState: 'DRAFT',
            returnEventId: null,
            simulation: {
              ...inspection,
              orderStatus: 'IN_PROGRESS',
              canControlSubmission: false,
              simulatedSubmissionVersionId: null,
              simulatedSubmissionVersionNumber: null,
              caseId: null,
              caseState: null,
            },
          },
        })
        cy.task('stubUp3Simulation', {
          path: `/orders/${orderId}`,
          response: {
            ...inspection,
            orderStatus: 'IN_PROGRESS',
            canControlSubmission: false,
            simulatedSubmissionVersionId: null,
            simulatedSubmissionVersionNumber: null,
            caseId: null,
            caseState: null,
          },
        })
        stubOrder(false, 'IN_PROGRESS')
        cy.get('#orderJson').type('{"deviceWearer":{}}', { parseSpecialCharSequences: false })
        cy.contains('button', 'Create simulated test order').click()
        cy.contains('This is an editable draft').should('be.visible')
        cy.contains('Set accepted').should('not.exist')
        cy.contains('Return order').should('not.exist')
      })
  })

  const viewports = [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]
  viewports.forEach(({ width, height }) => {
    it(`renders entry, inspection and creation without horizontal overflow at ${width}px`, () => {
      cy.viewport(width, height)
      const pages = ['/dev/up3-simulation', basePath, '/dev/up3-simulation/create']
      pages.forEach(path => {
        cy.visit(path)
        cy.get('h1').should('contain.text', 'Dev: simulate UP3')
        cy.document().its('documentElement.scrollWidth').should('be.lte', width)
      })
      cy.screenshot(`up3-creation-${width}px`)
    })
  })
})
