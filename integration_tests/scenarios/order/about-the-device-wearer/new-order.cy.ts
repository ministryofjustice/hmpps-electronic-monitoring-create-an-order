import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, kelvinCloseAddress } from '../../../mockApis/faker'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'

context('New about device wearer flow', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { INTERESTED_PARTIES_FLOW_ENABLED: true }

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.newOrderFormButton.click()

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()
  })
  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
    otherDisability: null,
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'Yes',
  }

  const primaryAddressDetails = {
    ...kelvinCloseAddress,
    hasAnotherAddress: 'No',
  }

  it('Should have contact number and addresses as part of device wearer section', () => {
    deviceWearerDetails.dob = new Date(2000, 0, 1)
    fillInAboutTheDeviceWearer({
      deviceWearerDetails,
      primaryAddressDetails,
    })
    const cyaPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')

    cyaPage.personDetailsSection.shouldExist()
    cyaPage.personDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's first name?", value: deviceWearerDetails.firstName },
      { key: "What is the device wearer's last name?", value: deviceWearerDetails.lastName },
      { key: "What is the device wearer's preferred name or names? (optional)", value: deviceWearerDetails.alias },
      { key: "What is the device wearer's date of birth?", value: '01/01/2000' },
      { key: 'Is a responsible adult required?', value: 'No' },
      { key: 'What is the sex of the device wearer?', value: deviceWearerDetails.sex },
      { key: "What is the device wearer's gender?", value: deviceWearerDetails.genderIdentity },
      {
        key: 'Does the device wearer have any of the disabilities or health conditions listed?',
        value: deviceWearerDetails.disabilities,
      },
      { key: 'What language does the interpreter need to use?', value: '' },
      { key: 'Is an interpreter needed?', value: 'No' },
    ])
    cyaPage.identityNumbersSection.shouldExist()
    cyaPage.identityNumbersSection.shouldHaveItems([
      { key: 'Police National Computer (PNC)', value: deviceWearerDetails.pncId },
      { key: 'National Offender Management Information System (NOMIS)', value: deviceWearerDetails.nomisId },
      { key: 'Prison Number', value: deviceWearerDetails.prisonNumber },
      { key: 'NDelius ID', value: deviceWearerDetails.deliusId },
      {
        key: 'Compliance and Enforcement Person Reference (CEPR)',
        value: deviceWearerDetails.complianceAndEnforcementPersonReference,
      },
      { key: 'Court Case Reference Number (CCRN)', value: deviceWearerDetails.courtCaseReferenceNumber },
    ])

    cyaPage.contactDetailsSection.shouldExist()
    cyaPage.contactDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's telephone number?", value: deviceWearerDetails.contactNumber },
      { key: 'Does the device wearer have a contact telephone number?', value: 'Yes' },
    ])

    cyaPage.deviceWearerAddressesSection.shouldExist()
    cyaPage.deviceWearerAddressesSection.shouldHaveItems([
      { key: 'Does the device wearer have a fixed address?', value: 'Yes' },
      { key: "What is the device wearer's main address?", value: '3 Kelvin Close, Birchwood, Warrington, WA3 7PB' },
    ])
  })
})
