import { v4 as uuidv4 } from 'uuid'
import mockApiOrder from '../../../utils/data/ApiOrder'
import Page from '../../../pages/page'
import ReturnReasonsPage from './returnReasonsPage'

const mockOrder = mockApiOrder('SUBMITTED', 'REJECTED')
const mockOrderId = mockOrder.id
const monitoringConditionsSection = 'Incorrect monitoring conditions'
const monitoringConditionsReasons = [
  'The monitoring conditions do not match the form.',
  'The licence and form must match.',
]
const deviceWearerSection = 'Incorrect device wearer details'
const deviceWearerReason = 'The device wearer details need to be corrected.'

const stubRejectedOrder = (additionalReasons = []) => {
  const reasons = [
    ...monitoringConditionsReasons.map(details => ({
      id: uuidv4(),
      statusUpdateId: uuidv4(),
      section: monitoringConditionsSection,
      details,
    })),
    ...additionalReasons,
  ]

  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: mockOrder.status,
    order: {
      ...mockOrder,
      statusUpdates: [
        {
          id: uuidv4(),
          versionId: mockOrder.versionId,
          status: 'REJECTED',
          datetimeOfStatusChange: '2026-01-01T12:00:00Z',
          statusUpdateReasons: reasons,
        },
      ],
    },
  })
}

const expectReasons = (page: ReturnReasonsPage, listIndex: number, reasons: string[]) => {
  page
    .reasonDetails(listIndex)
    .should('have.length', reasons.length)
    .each(($reason, index) => {
      cy.wrap($reason).should('have.text', reasons[index])
    })
}

context('Return reasons', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.signIn()
  })

  it('displays grouped rejected reasons and returns to the summary', () => {
    stubRejectedOrder()

    const page = Page.visit(ReturnReasonsPage, { orderId: mockOrderId })
    page.sectionHeadings.eq(0).should('have.text', monitoringConditionsSection)
    expectReasons(page, 0, monitoringConditionsReasons)
    page.backToFormButton.click()
    cy.url().should('include', `/order/${mockOrderId}/summary`)
  })

  it('displays reasons under separate section headings', () => {
    stubRejectedOrder([
      {
        id: uuidv4(),
        statusUpdateId: uuidv4(),
        section: deviceWearerSection,
        details: deviceWearerReason,
      },
    ])

    const page = Page.visit(ReturnReasonsPage, { orderId: mockOrderId })
    page.sectionHeadings.eq(0).should('have.text', monitoringConditionsSection)
    page.sectionHeadings.eq(1).should('have.text', deviceWearerSection)
    expectReasons(page, 0, monitoringConditionsReasons)
    expectReasons(page, 1, [deviceWearerReason])
  })
})
