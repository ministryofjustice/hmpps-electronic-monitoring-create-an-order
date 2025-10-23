import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'

context('Order type descriptions', () => {
  const currenDate = new Date()


  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  const primaryAddressDetails = {
    ...createFakeAddress(),
    hasAnotherAddress: 'No',
  }

  const installationAndRisk = {
    offence: 'Sexual offences',
    possibleRisk: 'Sex offender',
    riskCategory: 'Children under the age of 18 are living at the property',
    riskDetails: 'No risk',
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })


  it('Notification org is prison, full HDC and pilot flow', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    const orderTypeDetails = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      pilot: 'GPS acquisitive crime',
      typeOfAcquistiveCrime: 'Aggravated Burglary',
      policeForceArea: 'Kent',
      prarr: 'Yes',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }

    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
   
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })

 

  it('Notification org is prison, PRARR no', () => {
    const interestedParties = createFakeInterestedParties('Prison', 'Home Office', null, null)
    const orderTypeDetails = {
      sentenceType: 'Extended Determinate Sentence',        
      prarr: 'No',
      monitoringStartDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      monitoringEndDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      monitoringCondition: 'Trail monitoring',
    }
    
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
   
    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      interestedParties,
      primaryAddressDetails,
      installationAndRisk,
      orderTypeDetails,
    })
  })
})
