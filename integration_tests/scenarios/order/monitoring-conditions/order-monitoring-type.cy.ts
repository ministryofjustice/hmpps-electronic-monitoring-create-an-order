import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'

context('Monitoring type list flow', () => {
  const currentDate = new Date()
  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  const primaryAddressDetails = {
    ...createFakeAddress(),
    hasAnotherAddress: 'No',
  }

  const installationAndRisk = {
    offence: 'Sexual offences',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    riskDetails: 'No risk',
  }
  const testFlags = {
    ORDER_TYPE_DESCRIPTION_FLOW_ENABLED: true,
    LIST_MONITORING_CONDITION_FLOW_ENABLED: true,
  }

  let orderSummaryPage: OrderSummaryPage

  const trailMonitoringOrder = {
    startDate: new Date(currentDate.getFullYear(), 11, 1),
    endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
  }
  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Trail and AM', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
    const monitoringOrderTypeDescription = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime (EMAC)',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currentDate.getFullYear() + 1, 0, 1),
      monitoringEndDate: new Date(currentDate.getFullYear() + 2, 0, 1),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })

    const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
    trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
    trailMonitoringPage.form.saveAndContinueButton.click()
  })
})
