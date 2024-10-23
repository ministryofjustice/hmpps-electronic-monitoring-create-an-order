import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import AboutDeviceWearerPage from '../pages/order/about-the-device-wearer/device-wearer'
import {
  setFakerSeed,
  createFakeAdultDeviceWearer,
  createFakeResponsibleOfficer,
  createFakeAddress,
  createFakeOrganisation,
} from '../mockApis/faker'
import ContactDetailsPage from '../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../pages/order/contact-information/notifyingOrganisation'
import MonitoringConditionsPage from '../pages/order/monitoring-conditions'
import AlcoholMonitoringPage from '../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../pages/order/submit-success'

context('Screenshots', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    setFakerSeed(Math.random())

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it.skip('For UAT', () => {
    const deviceWearerDetails = createFakeAdultDeviceWearer()
    const primaryAddressDetails = createFakeAddress()
    const notifyingOrganisation = {
      ...createFakeOrganisation(),
      responsibleOfficer: createFakeResponsibleOfficer(),
    }

    cy.signIn()

    let indexPage = Page.verifyOnPage(IndexPage)
    cy.screenshot('indexPage', { overwrite: true })
    indexPage.newOrderFormButton().click()

    let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    cy.screenshot('orderSummaryPage', { overwrite: true })
    orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

    let aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()
    aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    cy.screenshot('aboutDeviceWearerPage', { overwrite: true })
    aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    let contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    cy.screenshot('contactDetailsPage', { overwrite: true })
    contactDetailsPage.form.fillInWith(deviceWearerDetails)
    contactDetailsPage.form.saveAndContinueButton.click()

    let noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    noFixedAbode.form.saveAndContinueButton.click()
    noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    cy.screenshot('noFixedAbode', { overwrite: true })
    noFixedAbode.form.fillInWith({
      hasFixedAddress: 'Yes',
    })
    noFixedAbode.form.saveAndContinueButton.click()

    let primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.saveAndContinueButton.click()
    primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    cy.screenshot('primaryAddressPage', { overwrite: true })
    primaryAddressPage.form.fillInWith({
      ...primaryAddressDetails,
      hasAnotherAddress: 'No',
    })
    primaryAddressPage.form.saveAndContinueButton.click()

    let notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    notifyingOrganisationPage.form.saveAndContinueButton.click()
    notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    cy.screenshot('notifyingOrganisationPage', { overwrite: true })
    notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
    notifyingOrganisationPage.form.saveAndContinueButton.click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
    monitoringConditionsPage.form.saveAndContinueButton.click()
    cy.screenshot('monitoringConditionsPage', { overwrite: true })
    monitoringConditionsPage.form.fillInWith({
      orderType: 'Post Release',
      monitoringRequired: [
        'Curfew with electronic monitoring',
        'Exclusion and inclusion zone monitoring',
        'Trail monitoring',
        'Mandatory attendance monitoring',
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
    monitoringConditionsPage.form.saveAndContinueButton.click()

    const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
    alcoholMonitoringPage.form.saveAndContinueButton.click()
    cy.screenshot('alcoholMonitoringPage', { overwrite: true })
    alcoholMonitoringPage.form.fillInWith({
      orderType: 'Post Release',
      monitoringType: 'Alcohol abstinence',
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90), // 30 days
      installLocation: 'at [installation address]',
    })
    alcoholMonitoringPage.form.saveAndReturnButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.submissionFormButton().click()

    const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
    cy.screenshot('submitSuccessPage', { overwrite: true })
    submitSuccessPage.backToYourApplications.click()

    indexPage = Page.verifyOnPage(IndexPage)
    cy.screenshot('indexPageAfterSubmission', { overwrite: true })
    indexPage.ordersListItems().contains('Submitted')
  })
})
