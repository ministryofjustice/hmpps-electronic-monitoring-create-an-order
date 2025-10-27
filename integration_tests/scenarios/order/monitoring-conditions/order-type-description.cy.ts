import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'

context('Order type descriptions', () => {
  const currenDate = new Date()

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
  let orderSummaryPage: OrderSummaryPage
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

  it('Notification org is prison, full HDC and pilot flow', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    const orderTypeDetails = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is prison, PRARR no', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    const orderTypeDetails = {
      sentenceType: 'Extended Determinate Sentence',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is YCS, sentence Section 250', () => {
    const interestedParties = createFakeInterestedParties('Youth Custody Service', 'Home Office', 'London', null)
    const orderTypeDetails = {
      sentenceType: 'Section 250 / Section 91',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is YCS, sentence Section DTO, Issp yes', () => {
    const interestedParties = createFakeInterestedParties('Youth Custody Service', 'Home Office', 'London', null)
    const orderTypeDetails = {
      sentenceType: 'Detention and Training Order',
      issp: 'Yes',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is Probation, order type Post Release, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties(
      'Probation Service',
      'Probation',
      'Kent, Surrey & Sussex',
      'Kent, Surrey & Sussex',
    )
    const probationDeliveryUnit = {
      unit: 'Surrey',
    }
    const orderTypeDetails = {
      orderType: 'Release from prison',
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'No',
      prarr: 'Yes',
      pilot: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
      probationDeliveryUnit,
    })
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties('Probation Service', 'Home Office', 'London', null)
    const orderTypeDetails = {
      orderType: 'Community',
      sentenceType: 'Youth Rehabilitation Order (YRO)',
      issp: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is Probation, ordertype community, sentence Section SDS, Pilot DAPOL, HDC no', () => {
    const interestedParties = createFakeInterestedParties('Probation Service', 'Home Office', 'London', null)
    const orderTypeDetails = {
      orderType: 'Community',
      sentenceType: 'Suspended Sentence',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is home office', () => {
    const interestedParties = createFakeInterestedParties('Home Office', 'Home Office', null, null)
    const orderTypeDetails = {
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

  it('Notification org is Civil', () => {
    const interestedParties = createFakeInterestedParties(
      'Civil & County Court',
      'Home Office',
      'Bedford County and Civil Court',
      null,
    )
    const orderTypeDetails = {
      orderType: 'Civil',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })
})
