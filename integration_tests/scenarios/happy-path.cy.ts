import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import AboutDeviceWearerPage from '../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleOfficerPage from '../pages/order/about-the-device-wearer/responsible-officer-details'

context('Scenarios', () => {
  context('Happy path', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', {
        name: 'Cemor Stubs',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
      })

      cy.signIn()
    })

    it('Should submit an order to the Serco API', () => {
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
  })
})
