import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAddress, createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import { stubAttachments } from '../../utils'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import SearchPage from '../../../pages/search'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import ServiceRequestTypePage from '../../../e2e/order/variation/service-request-type/serviceRequestTypePage'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import VariationSubmitSuccessPage from '../../../pages/order/variation-submit-success'
import IsRejectionPage from '../../../e2e/order/edit-order/is-rejection/isRejectionPage'
import ReceiptPage from '../../../pages/order/receipt'

context('Service-Request-Types', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = {
    SERVICE_REQUEST_TYPE_ENABLED: true,
  }
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

  const fillInNewOrder = () => {
    let indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

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
    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    indexPage.searchNav.click()

    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchBox.type(deviceWearerDetails.lastName)
    searchPage.searchButton.click()
    searchPage.ordersList.contains(deviceWearerDetails.fullName).click()

    Page.verifyOnPage(OrderSummaryPage).makeChanges()

    Page.verifyOnPage(ConfirmVariationPage).confirm()

    Page.verifyOnPage(IsRejectionPage).isNotRejection()
  }
  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
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

    fillInNewOrder()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Should able to make REINSTALL_AT_DIFFERENT_ADDRESS change', () => {
    const page = Page.verifyOnPage(ServiceRequestTypePage)
    page.form.fillInWith('I need monitoring equipment installed at a new address')
    page.form.continueButton.click()

    orderSummaryPage.fillInVariationsDetails({ variationDetails })
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

    orderSummaryPage.submitOrderButton.click()
    const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
    variationSubmitSuccessPage.receiptButton().click()
    const receptPage = Page.verifyOnPage(ReceiptPage)
    receptPage.orderStatusSection.shouldHaveItems([{ key: 'Type', value: 'Reinstall at different address' }])
  })

  it('Should able to make REINSTALL_DEVICE change', () => {
    const page = Page.verifyOnPage(ServiceRequestTypePage)
    page.form.fillInWith('I need monitoring equipment reinstalled or checked')
    page.form.continueButton.click()

    orderSummaryPage.fillInVariationsDetails({ variationDetails })
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

    orderSummaryPage.submitOrderButton.click()
    const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
    variationSubmitSuccessPage.receiptButton().click()
    const receptPage = Page.verifyOnPage(ReceiptPage)
    receptPage.orderStatusSection.shouldHaveItems([{ key: 'Type', value: 'Reinstall device' }])
  })

  it('Should able to make REVOCATION change', () => {
    const page = Page.verifyOnPage(ServiceRequestTypePage)
    page.form.fillInWith('I need to end all monitoring for the device wearer')
    page.form.continueButton.click()

    orderSummaryPage.fillInVariationsDetails({ variationDetails })
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

    orderSummaryPage.submitOrderButton.click()
    const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
    variationSubmitSuccessPage.receiptButton().click()
    const receptPage = Page.verifyOnPage(ReceiptPage)
    receptPage.orderStatusSection.shouldHaveItems([{ key: 'Type', value: 'End all monitoring' }])
  })

  it('Should able to make REVOCATION change', () => {
    const page = Page.verifyOnPage(ServiceRequestTypePage)
    page.form.fillInWith('I need to change something else in the form')
    page.form.continueButton.click()

    const fullVariationDetails = {
      variationType: 'The curfew hours',
      variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
      variationDetails: 'Change to address',
    }
    orderSummaryPage.fillInVariationsDetails({ variationDetails: fullVariationDetails })
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').continue()
    Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

    orderSummaryPage.submitOrderButton.click()
    const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
    variationSubmitSuccessPage.receiptButton().click()
    const receptPage = Page.verifyOnPage(ReceiptPage)
    receptPage.orderStatusSection.shouldHaveItems([{ key: 'Type', value: 'Change to an order' }])
  })
})
