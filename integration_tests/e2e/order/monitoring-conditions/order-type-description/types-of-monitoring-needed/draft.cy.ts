import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import TypesOfMonitoringNeededPage from './TypesOfMonitoringNeededPage'

const mockOrderId = uuidv4()

context('Types of monitoring needed', () => {
  const mockOrder = {
    monitoringConditions: {
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-02-01T00:00:00Z',
      orderType: 'CIVIL',
      curfew: true,
      exclusionZone: true,
      trail: true,
      mandatoryAttendance: true,
      alcohol: true,
      conditionType: 'BAIL_ORDER',
      orderTypeDescription: '',
      sentenceType: 'IPP',
      issp: 'YES',
      hdc: 'NO',
      prarr: 'UNKNOWN',
      pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
      offenceType: '',
    },
    curfewReleaseDateConditions: {
      curfewAddress: '',
      releaseDate: '2025-05-11',
      startTime: '19:00:00',
      endTime: '07:00:00',
    },
    installationLocation: {
      location: 'INSTALLATION',
    },
    addresses: [
      {
        addressType: 'INSTALLATION',
        addressLine1: '10 Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AB',
      },
    ],
    curfewConditions: {
      curfewAddress: 'PRIMARY,SECONDARY',
      endDate: '2024-11-11T00:00:00Z',
      startDate: '2024-11-11T00:00:00Z',
      curfewAdditionalDetails: 'some additional details',
    },
    dataDictionaryVersion: 'DDV5',
  }
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: mockOrder,
    })

    cy.signIn()
  })

  it('Should display items from the default mock order', () => {
    const page = Page.visit(TypesOfMonitoringNeededPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Curfew', 'From 11/11/2024 to 11/11/2024')

    page.form.summaryList.shouldNotHaveItem('Exclusion zone monitoring')
    page.form.summaryList.shouldNotHaveItem('Trail monitoring')
    page.form.summaryList.shouldNotHaveItem('Mandatory attendance monitoring')
    page.form.summaryList.shouldNotHaveItem('Alcohol monitoring')
  })
})
