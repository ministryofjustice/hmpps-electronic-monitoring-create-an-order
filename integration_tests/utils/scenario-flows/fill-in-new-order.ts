import Page from '../../pages/page'
import OrderTasksPage from '../../pages/order/summary'
import ProbationDeliveryUnitPage from '../../pages/order/contact-information/probation-delivery-unit'
import ContactInformationCheckYourAnswersPage from '../../pages/order/contact-information/check-your-answers'
import ResponsibleOrganisationPage from '../../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'
import NationalSecurityDirectoratePage from '../../e2e/order/interested-parties/national-security-directorate/nationalSecurityDirectoratePage'
import ResponsibleOfficerPage from '../../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import fillInTagAtSourceWith from './tag-at-source.cy'
import { fillInGeneralOrderDetailsWith } from './general-order-details'
import { continueFromMonitoringConditionsCya, fillInMonitoringConditionsWith } from './monitoring-conditions'
import { fillInInstallationAndRiskWith } from './risk'
import fillInAttachmentDetailsWith from './attachments'

function fillInResponsibleOrganisationFirstWith({ interestedParties, probationDeliveryUnit }): void {
  Page.verifyOnPage(OrderTasksPage).interestedPartiesTask.click()

  if (interestedParties.responsibleOfficer) {
    const responsibleOfficerPage = Page.verifyOnPage(ResponsibleOfficerPage)
    responsibleOfficerPage.form.fillInWith({
      firstName: interestedParties.responsibleOfficer.firstName,
      lastName: interestedParties.responsibleOfficer.lastName,
      email: interestedParties.responsibleOfficer.email,
    })
    responsibleOfficerPage.form.continueButton.click()
  }

  const responsibleOrgPage = Page.verifyOnPage(ResponsibleOrganisationPage)
  responsibleOrgPage.form.fillInWith(interestedParties)
  responsibleOrgPage.form.continueButton.click()

  if (interestedParties.responsibleOrganisation.toUpperCase() === 'PROBATION') {
    const nationalSecurityDirectoratePage = Page.verifyOnPage(NationalSecurityDirectoratePage)
    nationalSecurityDirectoratePage.form.fillInWith('No')
    nationalSecurityDirectoratePage.form.continueButton.click()
  }

  if (interestedParties.responsibleOrganisation.toUpperCase() === 'PROBATION' && probationDeliveryUnit !== undefined) {
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage, 'About the Responsible Organisation')
    probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
    probationDeliveryUnitPage.form.saveAndContinueButton.click()
  }

  const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
    ContactInformationCheckYourAnswersPage,
    'Check your answer',
    '',
    false,
    'About the Responsible Organisation',
  )
  contactInformationCheckYourAnswersPage.saveAndReturnButton.click()
}

export default function fillInNewOrderWith({
  deviceWearerDetails,
  responsibleAdultDetails,
  primaryAddressDetails,
  secondaryAddressDetails,
  interestedParties,
  installationAndRisk,
  installationAddressDetails,
  curfewReleaseDetails,
  curfewConditionDetails,
  curfewTimetable,
  enforcementZoneDetails,
  restrictionZoneDetails,
  secondEnforcementZoneDetails = undefined,
  alcoholMonitoringDetails,
  trailMonitoringDetails,
  attendanceMonitoringDetails,
  files,
  probationDeliveryUnit,
  installationLocation,
  installationAppointment,
  tertiaryAddressDetails = undefined,
  monitoringOrderTypeDescription = undefined,
  newDeviceWearerFlow = false,
}): void {
  const orderTasksPage = Page.verifyOnPage(OrderTasksPage)

  if (newDeviceWearerFlow && interestedParties.notifyingOrganisation !== 'Home Office') {
    fillInResponsibleOrganisationFirstWith({ interestedParties, probationDeliveryUnit })
  } else {
    orderTasksPage.aboutTheDeviceWearerTask.click()
  }

  fillInGeneralOrderDetailsWith({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    interestedParties,
    probationDeliveryUnit,
    tertiaryAddressDetails,
    monitoringOrderTypeDescription,
    newDeviceWearerFlow,
  })

  if (Array.isArray(monitoringOrderTypeDescription.monitoringCondition)) {
    fillInMonitoringConditionsWith({
      conditions: monitoringOrderTypeDescription.monitoringCondition,
      curfewConditionDetails,
      curfewReleaseDetails,
      curfewTimetable,
      enforcementZoneDetails,
      restrictionZoneDetails,
      secondEnforcementZoneDetails,
      alcoholMonitoringDetails,
      trailMonitoringDetails,
      attendanceMonitoringDetails,
    })
  }

  if (installationLocation) {
    fillInTagAtSourceWith(installationLocation, installationAppointment, installationAddressDetails)
  }

  continueFromMonitoringConditionsCya()

  fillInInstallationAndRiskWith({ installationAndRisk, interestedParties })

  fillInAttachmentDetailsWith({ files })

  Page.verifyOnPage(OrderTasksPage)
}
