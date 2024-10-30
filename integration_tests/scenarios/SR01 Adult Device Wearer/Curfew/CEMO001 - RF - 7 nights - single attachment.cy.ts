import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import {
  createFakeAdultDeviceWearer,
  createFakeResponsibleOfficer,
  createFakeAddress,
  createFakeOrganisation,
} from '../../../mockApis/faker'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../../../pages/order/contact-information/notifyingOrganisation'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import CurfewTimetablePage from '../../../pages/order/monitoring-conditions/curfew-timetable'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'
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

  it('Pre-Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am, plus photo attachment', () => {
    const deviceWearerDetails = createFakeAdultDeviceWearer()
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
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 5), // 5 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 45), // 45 days
      orderType: 'Pre-Trial',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: 'Curfew with electronic monitoring',
      devicesRequired: 'Location, not fitted',
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
      addresses: ['Primary address'],
    })
    curfewConditionsPage.form.saveAndContinueButton.click()

    const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    curfewTimetablePage.fillInForm({
      curfewTimeTable: [
        {
          dayOfWeek: 'MONDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
        {
          dayOfWeek: 'MONDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
        {
          dayOfWeek: 'TUESDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
        {
          dayOfWeek: 'TUESDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'SECONDARY_ADDRESS',
        },
        {
          dayOfWeek: 'WEDNESDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'SECONDARY_ADDRESS',
        },
        {
          dayOfWeek: 'WEDNESDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'TERTIARY_ADDRESS',
        },
        {
          dayOfWeek: 'THURSDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'TERTIARY_ADDRESS',
        },
        {
          dayOfWeek: 'THURSDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
        {
          dayOfWeek: 'FRIDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
        {
          dayOfWeek: 'FRIDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'SECONDARY_ADDRESS',
        },
        {
          dayOfWeek: 'SATURDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'SECONDARY_ADDRESS',
        },
        {
          dayOfWeek: 'SATURDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'TERTIARY_ADDRESS',
        },
        {
          dayOfWeek: 'SUNDAY',
          startTime: '00:00:00',
          endTime: '10:00:00',
          curfewAddress: 'TERTIARY_ADDRESS',
        },
        {
          dayOfWeek: 'SUNDAY',
          startTime: '19:00:00',
          endTime: '11:59:00',
          curfewAddress: 'PRIMARY_ADDRESS',
        },
      ],
    })
    curfewTimetablePage.form.saveAndContinueButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    // indexPage.ordersListItems().contains('Submitted')
  })
})
