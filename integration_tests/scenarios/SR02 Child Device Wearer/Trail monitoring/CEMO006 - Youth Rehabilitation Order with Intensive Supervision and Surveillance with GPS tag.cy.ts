import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import {
  createFakeYouthDeviceWearer,
  createFakeResponsibleOfficer,
  createFakeResponsibleAdult,
  createFakeAddress,
  createFakeOrganisation,
} from '../../../mockApis/faker'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../../../pages/order/contact-information/notifyingOrganisation'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'

context('Scenarios', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('Youth Rehabilitation Order with Intensive Supervision and Surveillance (Community) with GPS Tag (Location - Fitted).', () => {
    const deviceWearerDetails = createFakeYouthDeviceWearer()
    const responsibleAdultDetails = createFakeResponsibleAdult()
    const primaryAddressDetails = createFakeAddress()
    const installationAddressDetails = createFakeAddress()
    const notifyingOrganisation = {
      ...createFakeOrganisation(),
      responsibleOfficer: createFakeResponsibleOfficer(),
    }

    cy.signIn()

    let indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton().click()

    let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

    const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.fillInWith({
      ...deviceWearerDetails,
      interpreterRequired: false,
    })
    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultPage)
    responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
    responsibleAdultDetailsPage.form.saveAndContinueButton.click()

    const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    contactDetailsPage.form.fillInWith(deviceWearerDetails)
    contactDetailsPage.form.saveAndContinueButton.click()

    const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    noFixedAbode.form.fillInWith({
      hasFixedAddress: 'Yes',
    })
    noFixedAbode.form.saveAndContinueButton.click()

    const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.fillInWith({
      ...primaryAddressDetails,
      hasAnotherAddress: 'No',
    })
    primaryAddressPage.form.saveAndContinueButton.click()

    const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
    notifyingOrganisationPage.form.saveAndContinueButton.click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.saveAndContinueButton().click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.MonitoringConditionsSectionItem().click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      orderType: 'Community',
      orderTypeDescription: 'GPS Acquisitive Crime Parole',
      conditionType: 'Requirement of a Community Order',
      monitoringRequired: 'Trail monitoring',
      devicesRequired: 'Location, fitted',
    })
    monitoringConditionsPage.form.saveAndContinueButton.click()

    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()

    const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
    trailMonitoringPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      installLocation: `at Installation Address: ${installationAddressDetails}`,
    })
    trailMonitoringPage.form.saveAndContinueButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    // indexPage.ordersListItems().contains('Submitted')
  })
})
