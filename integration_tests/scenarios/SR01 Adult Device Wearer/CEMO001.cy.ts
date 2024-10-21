import Page from '../../pages/page'
import IndexPage from '../../pages/index'
import OrderSummaryPage from '../../pages/order/summary'
import AboutDeviceWearerPage from '../../pages/order/about-the-device-wearer/device-wearer'
// import ResponsibleAdultDetailsPage from '../../pages/order/about-the-device-wearer/responsible-adult-details'
import {
  createFakeAdultDeviceWearer,
  createFakeResponsibleOfficer,
  // createFakeResponsibleAdult,
  createFakeAddress,
  createFakeOrganisation,
} from '../../mockApis/faker'
import ContactDetailsPage from '../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../../pages/order/contact-information/notifyingOrganisation'
import { NotFoundErrorPage } from '../../pages/error'
import MonitoringConditionsPage from '../../pages/order/monitoringConditions'

context('Scenarios', () => {
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  it('Pre Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am, plus photo attachment', () => {
    const deviceWearerDetails = createFakeAdultDeviceWearer()
    // const responsibleAdultDetails = createFakeResponsibleAdult()
    const primaryAddressDetails = {
      hasFixedAddress: 'Yes',
      address: createFakeAddress(),
      isInstallAddress: 'Yes',
      monitorAnotherAddress: 'No',
    }
    const notifyingOrganisation = {
      ...createFakeOrganisation(),
      responsibleOfficer: createFakeResponsibleOfficer(),
    }

    cy.signIn()

    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton().click()

    let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

    const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
    aboutDeviceWearerPage.form.saveAndContinueButton.click()
    /*
    const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
    responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
    responsibleAdultDetailsPage.form.saveAndContinueButton.click()
    */
    const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
    contactDetailsPage.form.fillInWith(deviceWearerDetails)
    contactDetailsPage.form.saveAndContinueButton.click()

    const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
    noFixedAbode.form.fillInWith(primaryAddressDetails)
    noFixedAbode.form.saveAndContinueButton.click()

    const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.fillInWith(primaryAddressDetails)
    primaryAddressPage.form.saveAndContinueButton.click()

    const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)
    notifyingOrganisationPage.form.fillInWith(notifyingOrganisation)
    // notifyingOrganisationPage.form.saveAndContinueButton.click()
    notifyingOrganisationPage.backToSummaryButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.MonitoringConditionsSectionItem().click()

    const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
  })
})
