import Page from '../../pages/page'
import IndexPage from '../../pages/index'
import OrderSummaryPage from '../../pages/order/summary'
import AboutDeviceWearerPage from '../../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleOfficerPage from '../../pages/order/about-the-device-wearer/responsible-officer-details'

/*
New Monitoring Order Via CEMO for SR01 Adult Device Wearer.
Photo attachment
Order is Pre Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am.
*/

export default () => {
  it('Pre Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am, plus photo attachment', () => {
    cy.signIn()

    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton().click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
    orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

    const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
    aboutDeviceWearerPage.form.fillInWith({
      nomisId: '1234567',
      pncId: '1234567',
      deliusId: '1234567',
      prisonNumber: '1234567',
      firstNames: 'Marty',
      lastName: 'McFly',
      alias: 'McFly',
      dob: { date: '01', month: '10', year: '1970' },
      is18: true,
      sex: 'Male',
      genderIdentity: 'Male',
    })

    aboutDeviceWearerPage.form.saveAndContinueButton.click()

    Page.verifyOnPage(ResponsibleOfficerPage)
  })
}
