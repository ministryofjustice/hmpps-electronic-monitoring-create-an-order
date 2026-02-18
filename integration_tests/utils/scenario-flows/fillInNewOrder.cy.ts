import { createFakeAddress, createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../mockApis/faker'
import IndexPage from '../../pages'
import SubmitSuccessPage from '../../pages/order/submit-success'
import OrderSummaryPage from '../../pages/order/summary'
import Page from '../../pages/page'
import SearchPage from '../../pages/search'

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

export default function fillInNewOrder({ startDate = null, files }): void {
  trail.startDate = startDate || trail.startDate

  let indexPage = Page.verifyOnPage(IndexPage)
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
}
