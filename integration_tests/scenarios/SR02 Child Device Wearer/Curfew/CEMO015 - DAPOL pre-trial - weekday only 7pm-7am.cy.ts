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
import SubmitSuccessPage from '../../../pages/order/submit-success'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import CurfewTimetablePage from '../../../pages/order/monitoring-conditions/curfew-timetable'
import SecondaryAddressPage from '../../../pages/order/contact-information/secondary-address'

context('Scenarios', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('DAPOL (Pre Trial) with Radio Frequency (RF) (HMU + PID) on a Curfew (Monday - Friday) 7pm-7am. 2 address locations - one Requirement for each parent', () => {
    const deviceWearerDetails = createFakeYouthDeviceWearer()
    const responsibleAdultDetails = createFakeResponsibleAdult()
    const primaryAddressDetails = createFakeAddress()
    const secondaryAddressDetails = createFakeAddress()
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
      hasAnotherAddress: 'Yes',
    })
    primaryAddressPage.form.saveAndContinueButton.click()

    const secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
    secondaryAddressPage.form.fillInWith({
      ...secondaryAddressDetails,
      hasAnotherAddress: 'No',
    })
    secondaryAddressPage.form.saveAndContinueButton.click()

    const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
    notifyingOrganisationPage.form.saveAndContinueButton.click()

    const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    installationAndRiskPage.saveAndContinueButton().click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.MonitoringConditionsSectionItem().click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), // 30 days
      orderType: 'Post Release',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: 'Curfew with electronic monitoring',
      devicesRequired: 'Location, fitted',
    })
    monitoringConditionsPage.form.saveAndContinueButton.click()

    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()

    const curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
    curfewReleaseDatePage.form.fillInWith({
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: '19:00:00',
      endTime: '07:00:00',
      address: 'Primary address',
    })
    curfewReleaseDatePage.form.saveAndContinueButton.click()

    const curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
    curfewConditionsPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      addresses: ['Primary address', 'Secondary address'],
    })
    curfewConditionsPage.form.saveAndContinueButton.click()

    const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    curfewTimetablePage.form.fillInWith([
      {
        day: 'MONDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Primary address'],
      },
      {
        day: 'TUESDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Primary address'],
      },
      {
        day: 'TUESDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Primary address'],
      },
      {
        day: 'WEDNESDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Primary address'],
      },
      {
        day: 'WEDNESDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Primary address'],
      },
      {
        day: 'THURSDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Primary address'],
      },
      {
        day: 'THURSDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Primary address'],
      },
      {
        day: 'FRIDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Primary address'],
      },
    ])
    curfewTimetablePage.form.saveAndContinueButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    // indexPage.ordersListItems().contains('Submitted')
  })
})
