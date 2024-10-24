import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleAdultDetailsPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
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
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import EnforcementZonePage from '../../../pages/order/monitoring-conditions/enforcement-zone'
import SubmitSuccessPage from '../../../pages/order/submit-success'

context('Scenarios', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('Location Monitoring (Inclusion/Exclusion) (Post Release) with GPS Tag (Location - Fitted) (Inclusion/Exclusion zone). Excluded from Football Grounds, document attachment', () => {
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
    aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
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

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.fillInWith({
      orderType: 'Post Release',
      monitoringRequired: 'Exclusion and inclusion zone monitoring',
      devicesRequired: 'Location, fitted',
    })
    monitoringConditionsPage.form.saveAndContinueButton.click()

    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()

    const enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    enforcementZonePage.form.fillInWith({
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // + 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 91), // + 90 days
      /*
      uploadFile: {
        contents: 'I am a map of London football grounds',
        fileName: 'london-football-grounds.pdf',
      },
      */
      description: 'Excluded from Football Grounds',
      duration: '90 days',
      anotherZone: 'No',
    })
    // enforcementZonePage.form.saveAndContinueButton.click()
    enforcementZonePage.backToSummaryButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    // indexPage.ordersListItems().contains('Submitted')
  })
})
