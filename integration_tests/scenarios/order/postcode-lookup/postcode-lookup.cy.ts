import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import fillinAddress from '../../../utils/scenario-flows/postcode-lookup.cy'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('Postcode Lookup', () => {
  let orderSummaryPage: OrderSummaryPage

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
    otherDisability: null,
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    cy.task('stubOSDataHubPostcode', {
      httpStatus: 200,
      postcode: 'SA111AA',
      body: {
        results: [
          {
            DPA: {
              BUILDING_NUMBER: 10,
              THOROUGHFARE_NAME: 'DOWNING STREET',
              POST_TOWN: 'LONDON',
              POSTCODE: 'SA11 1AA',
              UPRN: '101',
            },
          },
        ],
      },
    })

    cy.task('stubOSDataHubUPRN', {
      httpStatus: 200,
      uprn: '101',
      body: {
        results: [
          {
            DPA: {
              BUILDING_NUMBER: 10,
              THOROUGHFARE_NAME: 'DOWNING STREET',
              POST_TOWN: 'LONDON',
              POSTCODE: 'SW1A 2AA',
              UPRN: '101',
            },
          },
        ],
      },
    })

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Prison', 'Probation', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()
  })

  it('Should able to search for postcode and select address', () => {
    fillInAboutTheDeviceWearer({ deviceWearerDetails })

    fillinAddress({ findAddress: { postcode: 'SA11 1AA' }, addressResult: { address: '10' }, enterAddress: {} })

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  })

  it('Should able to enter address manually', () => {
    fillInAboutTheDeviceWearer({ deviceWearerDetails })

    fillinAddress({
      findAddress: {},
      addressResult: {},
      enterAddress: { addressLine1: '90 Hotel Street', addressLine3: 'Bath', postcode: 'BA1 2FJ' },
    })

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  })

  it('Should able to search for a curfew address', () => {
    fillInAboutTheDeviceWearer({ deviceWearerDetails })

    fillinAddress({
      findAddress: { postcode: 'SA11 1AA' },
      addressResult: { address: '10' },
      enterAddress: {},
      addAnother: 'Yes',
    })

    fillinAddress({ findAddress: { postcode: 'SA11 1AA' }, addressResult: { address: '10' }, enterAddress: {} })

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  })
})
