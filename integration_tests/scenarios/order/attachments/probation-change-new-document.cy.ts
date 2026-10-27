import { v4 as uuidv4 } from 'uuid'
import { createFakeAddress, createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import { stubAttachments } from '../../utils'
import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import SearchPage from '../../../pages/search'
import OrderSummaryPage from '../../../pages/order/summary'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import VariationSubmitSuccessPage from '../../../pages/order/variation-submit-success'
import ReceiptPage from '../../../pages/order/receipt'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import IsRejectionPage from '../../../e2e/order/edit-order/is-rejection/isRejectionPage'
import IsAddressChangePage from '../../../e2e/order/edit-order/is-address-change/isAddressChangePage'
import ServiceRequestTypePage from '../../../e2e/order/variation/service-request-type/serviceRequestTypePage'
import NotifyingOrganisationPage from '../../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import NewDocumentPage from '../../../pages/order/attachments/newDocument'
import UploadLicencePage from '../../../pages/order/attachments/uploadLicence'
import HavePhotoPage from '../../../pages/order/attachments/havePhoto'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'
import fillInNewOrderWith from '../../../utils/scenario-flows/fill-in-new-order'

context('Attachments', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }

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
  const interestedParties = createFakeInterestedParties(
    'Probation service',
    'Probation',
    undefined,
    'Kent, Surrey & Sussex',
  )
  const probationDeliveryUnit = { unit: 'Surrey' }
  const installationAndRisk = {
    offence: 'Sexual offences',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    riskDetails: 'No risk',
  }
  const monitoringOrderTypeDescription = {
    sentenceType: 'Standard Determinate Sentence',
    hdc: 'No',
    prarr: 'Yes',
    pilot: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
    dapolMissedInError: 'Yes',
    monitoringCondition: ['Trail monitoring'],
  }
  const trailMonitoringDetails = {
    startDate: new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days ago
    endDate: new Date(new Date().getFullYear() + 1, 11, 1, 23, 59, 0),
  }
  const variationDetails = {
    variationType: 'The curfew hours',
    variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
    variationDetails: 'Change to address',
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')
    cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: true })

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PROBATION'],
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
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Probation change to a started order requires a new document to be uploaded', () => {
    createNewOrder({ notifyingOrganisation: interestedParties })

    fillInNewOrderWith({
      deviceWearerDetails,
      responsibleAdultDetails: undefined,
      primaryAddressDetails,
      secondaryAddressDetails: undefined,
      interestedParties,
      installationAndRisk,
      monitoringOrderTypeDescription,
      installationAddressDetails: undefined,
      trailMonitoringDetails,
      enforcementZoneDetails: undefined,
      alcoholMonitoringDetails: undefined,
      curfewReleaseDetails: undefined,
      curfewConditionDetails: undefined,
      curfewTimetable: undefined,
      attendanceMonitoringDetails: undefined,
      files,
      probationDeliveryUnit,
      installationLocation: undefined,
      installationAppointment: undefined,
      newDeviceWearerFlow: true,
      restrictionZoneDetails: undefined,
    })

    Page.verifyOnPage(OrderSummaryPage).submitOrderButton.click()
    Page.verifyOnPage(SubmitSuccessPage).backToYourApplications.click()

    Page.verifyOnPage(IndexPage).searchNav.click()
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchBox.type(deviceWearerDetails.lastName)
    searchPage.searchButton.click()
    searchPage.ordersList.contains(`${deviceWearerDetails.firstName} ${deviceWearerDetails.lastName}`).click()

    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    Page.verifyOnPage(IsRejectionPage).isNotRejection()

    const isAddressChangePage = Page.verifyOnPage(IsAddressChangePage)
    isAddressChangePage.form.fillInWith('No')
    isAddressChangePage.form.saveAndContinueButton.click()

    const serviceRequestTypePage = Page.verifyOnPage(ServiceRequestTypePage)
    serviceRequestTypePage.form.fillInWith('I need to change something else in the form')
    serviceRequestTypePage.form.continueButton.click()

    Page.verifyOnPage(NotifyingOrganisationPage).form.continueButton.click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.additionalDocumentsTask.shouldHaveStatus('Incomplete')

    orderSummaryPage.fillInVariationsDetails({ variationDetails })
    orderSummaryPage.aboutTheDeviceWearerTask.click()
    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').saveAndReturnButton.click()
    orderSummaryPage.riskInformationTask.click()
    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').saveAndReturnButton.click()
    orderSummaryPage.electronicMonitoringTask.click()
    Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').saveAndReturnButton.click()

    orderSummaryPage.additionalDocumentsTask.click()

    const newDocumentPage = Page.verifyOnPage(NewDocumentPage)
    newDocumentPage.form.needNewDocumentField.set('Yes')
    newDocumentPage.form.saveAndContinueButton.click()

    const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
    uploadLicencePage.form.fillInWith({ file: files.licence })
    uploadLicencePage.form.saveAndContinueButton.click()

    const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
    havePhotoPage.form.havePhotoField.set('No')
    havePhotoPage.form.saveAndContinueButton.click()

    const attachmentSummaryPage = Page.verifyOnPage(AttachmentSummaryPage)
    attachmentSummaryPage.attachmentsSection.shouldHaveItems([
      { key: 'Do you need to upload a new document?', value: 'Yes' },
      { key: 'Upload a copy of the licence or court order document', value: files.licence.fileName },
      { key: 'Do you have a photo to upload?', value: 'No' },
    ])
    attachmentSummaryPage.saveAndReturn()

    orderSummaryPage.additionalDocumentsTask.shouldHaveStatus('Complete')
    orderSummaryPage.submitOrderButton.click()

    Page.verifyOnPage(VariationSubmitSuccessPage).receiptButton().click()
    const receiptPage = Page.verifyOnPage(ReceiptPage)
    receiptPage.additionalDocumentsSection.shouldHaveItems([
      { key: 'Do you need to upload a new document?', value: 'Yes' },
      { key: 'Upload a copy of the licence or court order document', value: files.licence.fileName },
      { key: 'Do you have a photo to upload?', value: 'No' },
    ])
  })
})
