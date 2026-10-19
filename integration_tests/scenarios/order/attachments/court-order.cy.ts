import { v4 as uuidv4 } from 'uuid'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import fillInNewOrderWith from '../../../utils/scenario-flows/fill-in-new-order'
import ReceiptPage from '../../../pages/order/receipt'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('Service-Request-Types', () => {
  const fmsCaseId: string = uuidv4()

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })
  })

  it('Notifying org is court, should be able to submit, does not show court upload question', () => {
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

    const monitoringOrderTypeDescription = {
      orderType: 'Civil',

      monitoringCondition: ['Trail monitoring'],
    }

    const trailMonitoringOrder = {
      startDate: new Date(currentDate.getFullYear(), 11, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
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

    const interestedParties = createFakeInterestedParties('Family Court', 'Probation', null, 'North West')
    createNewOrder({
      notifyingOrganisation: interestedParties,
    })
    interestedParties.responsibleOfficer = null

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    fillInNewOrderWith({
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
      files: {},
      probationDeliveryUnit,
      installationLocation: undefined,
      installationAppointment: undefined,
      newDeviceWearerFlow: true,
      restrictionZoneDetails: undefined,
    })
    orderSummaryPage.submitOrderButton.click()
    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.receiptButton().click()
    const receiptPage = Page.verifyOnPage(ReceiptPage)
    receiptPage.additionalDocumentsSection.shouldHaveItems([{ key: 'Do you have a photo to upload?', value: 'No' }])
  })
})
