import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import fillInTagAtSourceWith from '../../../utils/scenario-flows/tag-at-source.cy'

context('Order type descriptions', () => {
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
  let orderSummaryPage: OrderSummaryPage

  const trailMonitoringOrder = {
    startDate: new Date(currentDate.getFullYear(), 11, 1),
    endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
  }
  beforeEach(() => {
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

  const verifyValueInCheckYourAnswerPage = (
    page: MonitoringConditionsCheckYourAnswersPage,
    label: string,
    value?: string,
  ) => {
    if (value) {
      page.monitoringConditionsSection.shouldHaveItem(label, value)
    } else {
      page.monitoringConditionsSection.shouldNotHaveItem(label)
    }
  }

  const verifyResult = ({
    monitoringOrderTypeDescription,
                            trailMonitoring = trailMonitoringOrder,
                            installationLocation = undefined,
    installationAppointment = undefined,
    installationAddressDetails = undefined,
  }) => {
    const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
    trailMonitoringPage.form.fillInWith(trailMonitoring)
    trailMonitoringPage.form.saveAndContinueButton.click()
    if (installationLocation) {
      fillInTagAtSourceWith(installationLocation, installationAppointment, installationAddressDetails)
    }
    const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')
    const expectedOrderType =
      monitoringOrderTypeDescription.orderType === 'Release from prison'
        ? 'Post Release'
        : monitoringOrderTypeDescription.orderType
    verifyValueInCheckYourAnswerPage(page, 'What is the order type?', expectedOrderType)

    verifyValueInCheckYourAnswerPage(
      page,
      'What type of sentence has the device wearer been given?',
      monitoringOrderTypeDescription.sentenceType,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      'Is the device wearer on a Home Detention Curfew (HDC)?',
      monitoringOrderTypeDescription.hdc,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      'What pilot project is the device wearer part of?',
      monitoringOrderTypeDescription.pilot,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      'What type of acquisitive crime offence did the device wearer commit?',
      monitoringOrderTypeDescription.typeOfAcquistiveCrime,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      "Which police force area is the device wearer's release address in?",
      monitoringOrderTypeDescription.policeForceArea,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
      monitoringOrderTypeDescription.issp,
    )

    verifyValueInCheckYourAnswerPage(
      page,
      'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
      monitoringOrderTypeDescription.prarr,
    )

    // Monitoring conditions
    verifyValueInCheckYourAnswerPage(
      page,
      'What monitoring does the device wearer need?',
      monitoringOrderTypeDescription.monitoringCondition,
    )

    // Dapol missed in error
    verifyValueInCheckYourAnswerPage(
      page,
      'Are you submitting this form becasue DAPOL was missed in error at point of release?',
      monitoringOrderTypeDescription.dapolMissedInError,
    )
  }

  it('Notification org is prison, full HDC and pilot flow', () => {
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

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })

    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is prison, PRARR no', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      sentenceType: 'Extended Determinate Sentence',
      prarr: 'Yes',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is YCS, sentence Section 250', () => {
    const interestedParties = createFakeInterestedParties('Youth Custody Service', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      sentenceType: 'Section 250 / Section 91',
      prarr: 'Yes',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is YCS, sentence Section DTO, Issp yes', () => {
    const interestedParties = createFakeInterestedParties('Youth Custody Service', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      sentenceType: 'Detention and Training Order',
      issp: 'Yes',
      prarr: 'Yes',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is Probation, order type Post Release, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties(
      'Probation Service',
      'Probation',
      null,
      'Kent, Surrey & Sussex',
    )
    const probationDeliveryUnit = {
      unit: 'Surrey',
    }
    const monitoringOrderTypeDescription = {
      orderType: 'Release from prison',
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'No',
      prarr: 'Yes',
      pilot: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
      monitoringCondition: 'Trail monitoring',
      dapolMissedInError: 'Yes',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
      probationDeliveryUnit,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties('Probation Service', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      orderType: 'Community',
      sentenceType: 'Youth Rehabilitation Order (YRO)',
      issp: 'Yes',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })

    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties('Probation Service', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      orderType: 'Community',
      sentenceType: 'Suspended Sentence',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })

  it('Notification org is home office', () => {
    const installationLocation = {
      location: 'At a prison',
    }

    const installationAppointment = {
      placeName: 'mock prison',
      appointmentDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(13, 0, 0, 0)),
    }
    const installationAddressDetails = createFakeAddress()
    const interestedParties = createFakeInterestedParties('Home Office', 'Home Office', null, null)
    const monitoringOrderTypeDescription = {
      monitoringCondition: 'Trail monitoring',
    }

    const trailMonitoringOrderWithDeviceType = {
      startDate: new Date(currentDate.getFullYear(), 11, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
      deviceType: 'A fitted GPS tag',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({
      monitoringOrderTypeDescription,
        trailMonitoring : trailMonitoringOrderWithDeviceType,
        installationLocation,
      installationAppointment,
      installationAddressDetails,
    })
  })

  it('Notification org is Civil', () => {
    const interestedParties = createFakeInterestedParties(
      'Civil & County Court',
      'Home Office',
      'Bedford County and Civil Court',
      null,
    )
    const monitoringOrderTypeDescription = {
      orderType: 'Civil',
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      monitoringOrderTypeDescription,
    })
    verifyResult({ monitoringOrderTypeDescription })
  })
})
