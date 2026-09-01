import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, kelvinCloseAddress } from '../../../mockApis/faker'
import fillInAboutTheDeviceWearer from '../../../utils/scenario-flows/about-the-device-wearer-flow.cy'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'
import { stubGetPersonByPrisonNumber, stubGetPersonByCrn } from '../../../mockApis/corePersonRecord'

context('New about device wearer flow', () => {
  let orderSummaryPage: OrderSummaryPage
  const mockCprResponse = {
    firstName: 'URHREEDE',
    middleNames: 'ANGELLE SHANIR',
    lastName: 'BOBBIQUA',
    dateOfBirth: '1974-05-08',
    disability: null,
    interestToImmigration: null,
    title: {
      code: null,
      description: null,
    },
    sex: {
      code: 'M',
      description: 'Male',
    },
    sexualOrientation: {
      code: null,
      description: null,
    },
    religion: {
      code: 'RAST',
      description: 'Rastafari',
    },
    ethnicity: {
      code: 'M9',
      description: 'Mixed : Any other background',
    },
    aliases: [
      {
        firstName: 'DYFREIICO',
        lastName: 'JODERLY',
        middleNames: null,
        title: {
          code: null,
          description: null,
        },
        sex: {
          code: 'M',
          description: 'Male',
        },
      },
    ],
    nationalities: [
      {
        code: 'BRIT',
        description: 'British',
      },
    ],
    addresses: [
      {
        cprAddressId: '0a314d09-99f7-4bea-979e-f67f3315269a',
        noFixedAbode: false,
        startDate: '2012-03-01',
        startDateTime: '2012-03-01T00:00:00',
        endDate: null,
        endDateTime: null,
        postcode: 'X27 8OS',
        subBuildingName: null,
        buildingName: null,
        buildingNumber: '20',
        thoroughfareName: null,
        dependentLocality: null,
        postTown: 'SomeWhere',
        county: 'SomeCounty',
        country: null,
        countryCode: null,
        uprn: null,
        status: {
          code: 'M',
          description: null,
        },
        comment: null,
        typeVerified: null,
        usages: [],
        contacts: [
          {
            type: {
              code: 'MOBILE',
              description: null,
            },
            value: '07403825555',
          },
        ],
      },
    ],
    identifiers: {
      crns: ['B123435'],
      prisonNumbers: ['A1234BC'],
      defendantIds: [],
      cids: [],
      pncs: ['1991/0078050W'],
      cros: ['078050/91E'],
      nationalInsuranceNumbers: [],
      driverLicenseNumbers: [],
      arrestSummonsNumbers: [],
      otherIdentifiers: [],
    },
  }
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
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
    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Prison', 'Probation', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    deviceWearerDetails.dob = new Date(2000, 0, 1)
    fillInAboutTheDeviceWearer({
      deviceWearerDetails,
      primaryAddressDetails,
      notifyingOrganisation: 'Prison',
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
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Prison number', value: deviceWearerDetails.nomisId }])

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

  it('Should load device wearer details from CPR for Prison', () => {
    stubGetPersonByPrisonNumber({
      httpStatus: 200,
      body: mockCprResponse,
      searchId: 'A1234BC',
    })

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Prison', 'Probation', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    const partiDeviceWearerDetails = {
      nomisId: 'A1234BC',
      genderIdentity: 'Male',
      is18: true,
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: false,
      language: '',
      hideContactNumberPage: true,
    }
    fillInAboutTheDeviceWearer({
      deviceWearerDetails: partiDeviceWearerDetails,
      notifyingOrganisation: 'Prison',
      loadFromCPR: true,
    })
    const cyaPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')

    cyaPage.personDetailsSection.shouldExist()
    cyaPage.personDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's first name?", value: 'URHREEDE' },
      { key: "What is the device wearer's middle name?", value: 'ANGELLE SHANIR' },
      { key: "What is the device wearer's last name?", value: 'BOBBIQUA' },
      { key: "What is the device wearer's preferred name or names? (optional)", value: 'DYFREIICO JODERLY' },
      { key: "What is the device wearer's date of birth?", value: '08/05/1974' },
      { key: 'Is a responsible adult required?', value: 'No' },
      { key: 'What is the sex of the device wearer?', value: 'Male' },
      { key: "What is the device wearer's gender?", value: partiDeviceWearerDetails.genderIdentity },
      {
        key: 'Does the device wearer have any of the disabilities or health conditions listed?',
        value: partiDeviceWearerDetails.disabilities,
      },
      { key: 'What language does the interpreter need to use?', value: '' },
      { key: 'Is an interpreter needed?', value: 'No' },
    ])
    cyaPage.identityNumbersSection.shouldExist()
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Prison number', value: 'A1234BC' }])
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Police National Computer (PNC)', value: '1991/0078050W' }])
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Case Reference Number (CRN)', value: 'B123435' }])

    cyaPage.contactDetailsSection.shouldExist()
    cyaPage.contactDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's telephone number?", value: '07403825555' },
      { key: 'Does the device wearer have a contact telephone number?', value: 'Yes' },
    ])

    cyaPage.deviceWearerAddressesSection.shouldExist()
    cyaPage.deviceWearerAddressesSection.shouldHaveItems([
      { key: 'Does the device wearer have a fixed address?', value: 'Yes' },
      { key: "What is the device wearer's main address?", value: '20, Somewhere, Somecounty, X27 8OS' },
    ])
  })

  it('Should load device wearer details from CPR for Probation', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PROBATION'],
    })
    stubGetPersonByCrn({
      httpStatus: 200,
      body: mockCprResponse,
      searchId: 'B123435',
    })

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Probation service', 'Probation', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    const partiDeviceWearerDetails = {
      deliusId: 'B123435',
      genderIdentity: 'Male',
      is18: true,
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: false,
      language: '',
      hideContactNumberPage: true,
    }
    fillInAboutTheDeviceWearer({
      deviceWearerDetails: partiDeviceWearerDetails,
      notifyingOrganisation: 'Probation',
      loadFromCPR: true,
    })
    const cyaPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')

    cyaPage.personDetailsSection.shouldExist()
    cyaPage.personDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's first name?", value: 'URHREEDE' },
      { key: "What is the device wearer's middle name?", value: 'ANGELLE SHANIR' },
      { key: "What is the device wearer's last name?", value: 'BOBBIQUA' },
      { key: "What is the device wearer's preferred name or names? (optional)", value: 'DYFREIICO JODERLY' },
      { key: "What is the device wearer's date of birth?", value: '08/05/1974' },
      { key: 'Is a responsible adult required?', value: 'No' },
      { key: 'What is the sex of the device wearer?', value: 'Male' },
      { key: "What is the device wearer's gender?", value: partiDeviceWearerDetails.genderIdentity },
      {
        key: 'Does the device wearer have any of the disabilities or health conditions listed?',
        value: partiDeviceWearerDetails.disabilities,
      },
      { key: 'What language does the interpreter need to use?', value: '' },
      { key: 'Is an interpreter needed?', value: 'No' },
    ])
    cyaPage.identityNumbersSection.shouldExist()
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Prison number', value: 'A1234BC' }])
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Police National Computer (PNC)', value: '1991/0078050W' }])
    cyaPage.identityNumbersSection.shouldHaveItems([{ key: 'Case Reference Number (CRN)', value: 'B123435' }])

    cyaPage.contactDetailsSection.shouldExist()
    cyaPage.contactDetailsSection.shouldHaveItems([
      { key: "What is the device wearer's telephone number?", value: '07403825555' },
      { key: 'Does the device wearer have a contact telephone number?', value: 'Yes' },
    ])

    cyaPage.deviceWearerAddressesSection.shouldExist()
    cyaPage.deviceWearerAddressesSection.shouldHaveItems([
      { key: 'Does the device wearer have a fixed address?', value: 'Yes' },
      { key: "What is the device wearer's main address?", value: '20, Somewhere, Somecounty, X27 8OS' },
    ])
  })
})
