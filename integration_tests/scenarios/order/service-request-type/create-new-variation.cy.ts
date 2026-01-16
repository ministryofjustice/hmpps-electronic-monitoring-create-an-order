import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAddress, createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import { stubAttachments } from '../../utils'
import SearchPage from '../../../pages/search'
import ServiceRequestTypePage from '../../../e2e/order/variation/service-request-type/serviceRequestTypePage'
import VariationSubmitSuccessPage from '../../../pages/order/variation-submit-success'
import ReceiptPage from '../../../pages/order/receipt'

context('Service-Request-Types', () => {
  const testFlags = {
    SERVICE_REQUEST_TYPE_ENABLED: true,
  }
  const currentDate = new Date()
  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
    otherDisability: null,
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

  const trail = {
    startDate: new Date(currentDate.getFullYear(), 11, 1),
    endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
  }

  const hmppsDocumentId: string = uuidv4()
  const fmsCaseId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }
  const interestedParties = createFakeInterestedParties('Prison', 'Home Office', 'Altcourse Prison', null)
  const monitoringOrderTypeDescription = {
    sentenceType: 'Standard Determinate Sentence',
    hdc: 'Yes',
    pilot: 'GPS acquisitive crime (EMAC)',
    typeOfAcquistiveCrime: 'Aggravated Burglary',
    policeForceArea: 'Kent',
    prarr: 'Yes',
    monitoringCondition: 'Trail monitoring',
  }

  const variationDetails = {
    variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
    variationDetails: 'Change to address',
  }

  const fillInNewOrder = (option: string, type: string, variation = variationDetails) => {
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.searchNav.click()
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchBox.type('Should not exist')
    searchPage.searchButton.click()
    searchPage.variationFormButton.click()

    const page = Page.verifyOnPage(ServiceRequestTypePage)
    page.form.fillInWith(option)
    page.form.continueButton.click()

    let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.fillInVariationsDetails({ variationDetails: variation })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.fillInNewOrderWith({
      deviceWearerDetails,
      responsibleAdultDetails: undefined,
      primaryAddressDetails,
      secondaryAddressDetails: undefined,
      interestedParties,
      installationAndRisk,
      monitoringOrderTypeDescription,
      installationAddressDetails: undefined,
      trailMonitoringDetails: trail,
      enforcementZoneDetails: undefined,
      alcoholMonitoringDetails: undefined,
      curfewReleaseDetails: undefined,
      curfewConditionDetails: undefined,
      curfewTimetable: undefined,
      attendanceMonitoringDetails: undefined,
      files,
      probationDeliveryUnit: undefined,
      installationLocation: undefined,
      installationAppointment: undefined,
    })

    orderSummaryPage.submitOrderButton.click()
    const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
    variationSubmitSuccessPage.receiptButton().click()
    const receiptPage = Page.verifyOnPage(ReceiptPage)
    receiptPage.orderStatusSection.shouldHaveItems([{ key: 'Type', value: type }])
  }
  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    cy.task('stubFMSUpdateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSUpdateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)

    cy.signIn()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Should able to create new REINSTALL_AT_DIFFERENT_ADDRESS', () => {
    fillInNewOrder('I need monitoring equipment installed at a new address', 'Reinstall at different address')
  })

  it('Should able to create new REINSTALL_DEVICE', () => {
    fillInNewOrder('I need monitoring equipment reinstalled or checked', 'Reinstall device')
  })

  it('Should able to create new REINSTALL_AT_DIFFERENT_ADDRESS', () => {
    fillInNewOrder('I need to end all monitoring for the device wearer', 'End all monitoring')
  })

  it('Should able to create new VARIATION', () => {
    const fullVariationDetails = {
      variationType: 'The curfew hours',
      variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
      variationDetails: 'Change to address',
    }
    fillInNewOrder('I need to change something else in the form', 'Change to an order', fullVariationDetails)
  })
})
