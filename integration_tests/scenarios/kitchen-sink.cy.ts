import {
  createFakeAdultDeviceWearer,
  createFakeResponsibleOfficer,
  createFakeAddress,
  createFakeOrganisation,
} from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import AboutDeviceWearerPage from '../pages/order/about-the-device-wearer/device-wearer'
import ContactDetailsPage from '../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../pages/order/contact-information/primary-address'
import SecondaryAddressPage from '../pages/order/contact-information/secondary-address'
import TertiaryAddressPage from '../pages/order/contact-information/tertiary-adddress'
import NotifyingOrganisationPage from '../pages/order/contact-information/notifyingOrganisation'
import MonitoringConditionsPage from '../pages/order/monitoring-conditions'
import AlcoholMonitoringPage from '../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../pages/order/submit-success'
import InstallationAddressPage from '../pages/order/monitoring-conditions/installation-address'
import CurfewReleaseDatePage from '../pages/order/monitoring-conditions/curfew-release-date'
import CurfewTimetablePage from '../pages/order/monitoring-conditions/curfew-timetable'
import InstallationAndRiskPage from '../pages/order/installationAndRisk'
import CurfewConditionsPage from '../pages/order/monitoring-conditions/curfew-conditions'
import EnforcementZonePage from '../pages/order/monitoring-conditions/enforcement-zone'

context('The kitchen sink', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('Fill in everything "including the kitchen sink" and screenshot', () => {
    const deviceWearerDetails = createFakeAdultDeviceWearer()
    const primaryAddressDetails = createFakeAddress()
    const secondaryAddressDetails = createFakeAddress()
    const tertiaryAddressDetails = createFakeAddress()
    const installationAddressDetails = createFakeAddress()
    const notifyingOrganisation = {
      ...createFakeOrganisation(),
      responsibleOfficer: createFakeResponsibleOfficer(),
    }

    cy.signIn()

    let indexPage = Page.verifyOnPage(IndexPage)
    cy.screenshot('01. indexPage', { overwrite: true })
    indexPage.newOrderFormButton().click()

    let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    cy.screenshot('02. orderSummaryPage', { overwrite: true })
    orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

    let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()
    aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    cy.screenshot('03. aboutDeviceWearerPage - validation', { overwrite: true })
    aboutDeviceWearerPage.form.fillInWith({
      ...deviceWearerDetails,
      interpreterRequired: true,
      language: 'Flemish (Dutch)',
    })
    cy.screenshot('04. aboutDeviceWearerPage', { overwrite: true })
    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    cy.screenshot('05. contactDetailsPage - validation', { overwrite: true })
    contactDetailsPage.form.fillInWith(deviceWearerDetails)
    contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    cy.screenshot('06. contactDetailsPage', { overwrite: true })
    contactDetailsPage.form.saveAndContinueButton.click()

    let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    noFixedAbode.form.saveAndContinueButton.click()
    noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    cy.screenshot('07. noFixedAbode - validation', { overwrite: true })
    noFixedAbode.form.fillInWith({
      hasFixedAddress: 'Yes',
    })
    cy.screenshot('08. noFixedAbode', { overwrite: true })
    noFixedAbode.form.saveAndContinueButton.click()

    let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.saveAndContinueButton.click()
    primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    cy.screenshot('09. primaryAddressPage - validation', { overwrite: true })
    primaryAddressPage.form.fillInWith({
      ...primaryAddressDetails,
      hasAnotherAddress: 'Yes',
    })
    cy.screenshot('10. primaryAddressPage', { overwrite: true })
    primaryAddressPage.form.saveAndContinueButton.click()

    let secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
    secondaryAddressPage.form.saveAndContinueButton.click()
    secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
    cy.screenshot('11. secondaryAddressPage - validation', { overwrite: true })
    secondaryAddressPage.form.fillInWith({
      ...secondaryAddressDetails,
      hasAnotherAddress: 'Yes',
    })
    cy.screenshot('12. secondaryAddressPage - validation', { overwrite: true })
    secondaryAddressPage.form.saveAndContinueButton.click()

    let tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
    tertiaryAddressPage.form.saveAndContinueButton.click()
    tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
    cy.screenshot('13. tertiaryAddressPage - validation', { overwrite: true })
    tertiaryAddressPage.form.fillInWith({
      ...tertiaryAddressDetails,
    })
    cy.screenshot('14. tertiaryAddressPage', { overwrite: true })
    tertiaryAddressPage.form.saveAndContinueButton.click()

    // no validation
    let notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    // notifyingOrganisationPage.form.saveAndContinueButton.click()
    notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    cy.screenshot('15. notifyingOrganisationPage - validation', { overwrite: true })
    notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
    cy.screenshot('16. notifyingOrganisationPage - validation', { overwrite: true })
    notifyingOrganisationPage.form.saveAndContinueButton.click()

    // no validation
    let installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    // installationAndRiskPage.saveAndContinueButton().click()
    installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
    cy.screenshot('17. installationAndRiskPage - validation', { overwrite: true })
    // installationAndRiskPage.fillInWith()
    cy.screenshot('18. installationAndRiskPage', { overwrite: true })
    installationAndRiskPage.saveAndContinueButton().click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.MonitoringConditionsSectionItem().click()

    let monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.saveAndContinueButton.click()
    monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    cy.screenshot('19. monitoringConditionsPage - validation', { overwrite: true })
    monitoringConditionsPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      isPartOfACP: 'No',
      isPartOfDAPOL: 'No',
      orderType: 'Post Release',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: [
        'Curfew with electronic monitoring',
        'Exclusion and inclusion zone monitoring',
        // 'Trail monitoring',
        // 'Mandatory attendance monitoring',
        'Alcohol monitoring',
      ],
      devicesRequired: [
        'Location, fitted',
        'Location, not fitted',
        'Radio frequency',
        'Alcohol, transdermal',
        'Alcohol, remote breath',
      ],
    })
    cy.screenshot('20. monitoringConditionsPage', { overwrite: true })
    monitoringConditionsPage.form.saveAndContinueButton.click()

    let installationAddressPage = Page.verifyOnPage(InstallationAddressPage)
    installationAddressPage.form.saveAndContinueButton.click()
    installationAddressPage = Page.verifyOnPage(InstallationAddressPage)
    cy.screenshot('21. installationAddressPage - validation', { overwrite: true })
    installationAddressPage.form.fillInWith(installationAddressDetails)
    cy.screenshot('22. installationAddressPage', { overwrite: true })
    installationAddressPage.form.saveAndContinueButton.click()

    let curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
    curfewReleaseDatePage.form.saveAndContinueButton.click()
    curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
    cy.screenshot('23. curfewReleaseDatePage - validation', { overwrite: true })
    curfewReleaseDatePage.form.fillInWith({
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: '19:00:00',
      endTime: '07:00:00',
      address: 'Primary address',
    })
    cy.screenshot('24. curfewReleaseDatePage', { overwrite: true })
    curfewReleaseDatePage.form.saveAndContinueButton.click()

    let curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
    curfewConditionsPage.form.saveAndContinueButton.click()
    curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
    cy.screenshot('25. curfewConditionsPage - validation', { overwrite: true })
    curfewConditionsPage.form.fillInWith({
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      addresses: ['Primary address', 'Secondary address', 'Tertiary address'],
    })
    cy.screenshot('26. curfewConditionsPage', { overwrite: true })
    curfewConditionsPage.form.saveAndContinueButton.click()

    let curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    curfewTimetablePage.form.saveAndContinueButton.click()
    curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
    cy.screenshot('27. curfewTimetablePage - validation', { overwrite: true })
    curfewTimetablePage.form.fillInWith([
      {
        day: 'MONDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Primary address'],
      },
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
        addresses: ['Secondary address'],
      },
      {
        day: 'WEDNESDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Secondary address'],
      },
      {
        day: 'WEDNESDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Tertiary address'],
      },
      {
        day: 'THURSDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Tertiary address'],
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
      {
        day: 'FRIDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Secondary address'],
      },
      {
        day: 'SATURDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Secondary address'],
      },
      {
        day: 'SATURDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Tertiary address'],
      },
      {
        day: 'SUNDAY',
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: ['Tertiary address'],
      },
      {
        day: 'SUNDAY',
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: ['Primary address'],
      },
    ])
    cy.screenshot('28. curfewTimetablePage', { overwrite: true })
    curfewTimetablePage.form.saveAndContinueButton.click()

    let enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    enforcementZonePage.form.saveAndContinueButton.click()
    enforcementZonePage = Page.verifyOnPage(EnforcementZonePage)
    cy.screenshot('29. enforcementZonePage - validation', { overwrite: true })
    enforcementZonePage.form.fillInWith({
      zoneType: 'Exclusion zone',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
    })
    cy.screenshot('30. enforcementZonePage', { overwrite: true })
    enforcementZonePage.form.saveAndContinueButton.click()

    let alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
    alcoholMonitoringPage.form.saveAndContinueButton.click()
    alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
    cy.screenshot('31. alcoholMonitoringPage - validation', { overwrite: true })
    alcoholMonitoringPage.form.fillInWith({
      // orderType: 'Post Release',
      monitoringType: 'Alcohol abstinence',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      installLocation: /at Installation Address/,
    })
    cy.screenshot('32. alcoholMonitoringPage', { overwrite: true })
    alcoholMonitoringPage.form.saveAndContinueButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    cy.screenshot('33. submitSuccessPage', { overwrite: true })
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    cy.screenshot('34. indexPageAfterSubmission', { overwrite: true })
    indexPage.ordersListItems().contains('Submitted')
  })
})
