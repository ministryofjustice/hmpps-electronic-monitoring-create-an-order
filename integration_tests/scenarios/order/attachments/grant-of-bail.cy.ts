import { v4 as uuidv4 } from 'uuid'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import { stubAttachments } from '../../utils'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import Page from '../../../pages/page'
import IndexPage from '../../../pages'
import OrderSummaryPage from '../../../pages/order/summary'
import ReceiptPage from '../../../pages/order/receipt'

context('Service-Request-Types', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()

  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }

  beforeEach(() => {
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

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)

    cy.signIn()
  })

  it('Notifying org is home office, should able to upload grant of bail and submit', () => {
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
    const installationAddressDetails = createFakeAddress()
    const interestedParties = createFakeInterestedParties('Home Office', 'Probation', null, 'North West')

    const monitoringOrderTypeDescription = {
      monitoringCondition: ['Trail monitoring'],
    }

    const trailMonitoringOrder = {
      startDate: new Date(currentDate.getFullYear(), 11, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
      deviceType: 'A fitted GPS tag',
    }
    const probationDeliveryUnit = {
      unit: 'Blackburn',
    }

    const installationAndRisk = {
      offence: 'Sexual offences',
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }

    const attachmentFiles = {
      grantOfBail: { fileName: files.licence.fileName, contents: files.licence.contents, fileRequired: 'Yes' },
    }

    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.fillInNewOrderWith({
      deviceWearerDetails,
      responsibleAdultDetails: undefined,
      primaryAddressDetails,
      secondaryAddressDetails: undefined,
      interestedParties,
      installationAndRisk,
      monitoringOrderTypeDescription,
      installationAddressDetails,
      curfewReleaseDetails: undefined,
      curfewConditionDetails: undefined,
      curfewTimetable: undefined,
      enforcementZoneDetails: undefined,
      alcoholMonitoringDetails: undefined,
      trailMonitoringDetails: trailMonitoringOrder,
      attendanceMonitoringDetails: undefined,
      files: attachmentFiles,
      probationDeliveryUnit,
      installationLocation: undefined,
      installationAppointment: undefined,
    })
    orderSummaryPage.submitOrderButton.click()
    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.receiptButton().click()
    const receiptPage = Page.verifyOnPage(ReceiptPage)
    receiptPage.additionalDocumentsSection.shouldHaveItems([
      { key: 'Do you have a Grant of Bail to upload?', value: 'Yes' },
      { key: 'Upload a copy of the Grant of Bail document', value: 'test.pdf' },
      { key: 'Do you have a photo to upload?', value: 'No' },
    ])
  })
})
