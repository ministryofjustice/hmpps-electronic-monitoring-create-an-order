import { v4 as uuidv4 } from 'uuid'
import mockApiOrder from '../../utils/data/ApiOrder'

const mockOrder = mockApiOrder('SUBMITTED', 'REJECTED')
const mockOrderId = mockOrder.id
const reasonListName = 'Reasons for returning this form'
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

const expectReasons = (listIndex: number, reasons: string[]) => {
  cy.get(`ul[aria-label="${reasonListName}"]`)
    .eq(listIndex)
    .find('li')
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

    cy.visit(`/order/${mockOrderId}/return-reasons`)
    cy.get('h1').should('contain.text', 'EMS gave these reasons for returning this form')
    cy.get('h2').eq(0).should('have.text', monitoringConditionsSection)
    expectReasons(0, monitoringConditionsReasons)
    cy.contains('button', 'Back to form').click()
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

    cy.visit(`/order/${mockOrderId}/return-reasons`)
    cy.get('h2').eq(0).should('have.text', monitoringConditionsSection)
    cy.get('h2').eq(1).should('have.text', deviceWearerSection)
    expectReasons(0, monitoringConditionsReasons)
    expectReasons(1, [deviceWearerReason])
  })
})
