import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties } from '../../../mockApis/faker'
import OffencePage from '../../../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OffenceListPage from '../../../e2e/order/access-needs-installation-risk/offences/offence-list/offenceListPage'
import DapoPage from '../../../e2e/order/access-needs-installation-risk/offences/dapo/DapoPage'
import OffenceDeletePage from '../../../e2e/order/access-needs-installation-risk/offences/delete/OffenceListDeletePage'
import DetailsOfInstallationPage from '../../../e2e/order/access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import IsMappaPage from '../../../e2e/order/access-needs-installation-risk/is-mappa/IsMappaPage'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('offences', () => {
  let orderSummaryPage: OrderSummaryPage
  const testFlags = { OFFENCE_FLOW_ENABLED: true }

  const deviceWearerDetails = {
    ...createFakeAdultDeviceWearer(),
    disabilities: 'Not able to provide this information',
    interpreterRequired: false,
    language: '',
    hasFixedAddress: 'No',
  }

  const detailsOfInstallation = {
    possibleRisks: ['Violent behaviour or threats of violence'],
    riskCategories: ['Safeguarding child'],
    riskDetails: 'some details',
  }

  beforeEach(() => {
    cy.task('setFeatureFlags', testFlags)
    cy.task('resetDB')
    cy.task('reset')
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Notifying organisation is Prison, single offence flow', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Prison', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    // Should go to offence page
    const offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith({ offenceType: 'Criminal damage and arson' })
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence other information page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.hasOtherInformationField.set('No')
    offenceOtherInfoPage.form.saveAndContinueButton.click()
    // Should go to details of installation page
    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    // CYA page
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItems([
      {
        key: 'What type of offence did the device wearer commit?',
        value: 'Criminal damage and arson',
      },
      {
        key: 'Any other information to be aware of about the offence committed?',
        value: '',
      },
      {
        key: "At installation what are the possible risks from the device wearer's behaviour?",
        value: 'Violent behaviour or threats of violence',
      },
      {
        key: 'What are the possible risks at the installation address? (optional)',
        value: 'Safeguarding child',
      },
      {
        key: 'Any other risks to be aware of? (optional)',
        value: 'some details',
      },
    ])
  })

  it('Notifying organisation is civil court, multiple offences flow', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Civil and County Court', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    const offences = [
      { offenceType: 'Criminal damage and arson', offenceDate: new Date(2025, 1, 1) },
      { offenceType: 'Sexual offences', offenceDate: new Date(2025, 2, 2) },
    ]

    // Should go to offence page
    let offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith(offences[0])
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.summaryList.shouldHaveItem('Criminal damage and arson', 'on 01/02/2025')
    offenceList.form.fillInWith({ addOffence: 'Yes' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to offence page
    offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith(offences[1])
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.summaryList.shouldHaveItem('Criminal damage and arson', 'on 01/02/2025')
    offenceList.form.summaryList.shouldHaveItem('Sexual offences', 'on 02/03/2025')
    offenceList.form.fillInWith({ addOffence: 'No' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to offence other information page
    const offenceOtherInfoPage = Page.verifyOnPage(OffenceOtherInfoPage)
    offenceOtherInfoPage.form.fillInWith({
      hasOtherInformation: 'Yes',
      otherInformationDetails: 'offender has a history of aggressive behaviour',
    })
    offenceOtherInfoPage.form.saveAndContinueButton.click()
    // Should go to details of installation page
    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    // CYA page
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldHaveItems([
      { key: 'Offences', value: 'Criminal damage and arson on 01/02/2025' },
      { key: 'Offences', value: 'Sexual offences on 02/03/2025' },
      {
        key: 'Any other information to be aware of about the offence committed?',
        value: 'offender has a history of aggressive behaviour',
      },
      {
        key: "At installation what are the possible risks from the device wearer's behaviour?",
        value: 'Violent behaviour or threats of violence',
      },
      {
        key: 'What are the possible risks at the installation address? (optional)',
        value: 'Safeguarding child',
      },
      {
        key: 'Any other risks to be aware of? (optional)',
        value: 'some details',
      },
    ])
  })

  it('Notifying organisation is family court, multiple dapo flow', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Family Court', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    const dapoClauses = [
      { dapoClauseNumber: '1234', dapoDate: new Date(2025, 1, 1) },
      { dapoClauseNumber: '5678', dapoDate: new Date(2025, 2, 2) },
    ]

    // Should go to dapo and date page
    let dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.fillInWith(dapoClauses[0])
    dapoPage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
    offenceList.form.summaryList.shouldHaveItem('1234', 'on 01/02/2025')
    offenceList.form.fillInWith({ addDapoClause: 'Yes' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to dapo and date page
    dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.fillInWith(dapoClauses[1])
    dapoPage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
    offenceList.form.summaryList.shouldHaveItem('1234', 'on 01/02/2025')
    offenceList.form.summaryList.shouldHaveItem('5678', 'on 02/03/2025')
    offenceList.form.fillInWith({ addDapoClause: 'No' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to details of installation page
    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    // CYA page
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldExist()
    cyaPage.installationRiskSection.shouldHaveItems([
      { key: 'DAPO order clauses', value: '1234 on 01/02/2025' },
      { key: 'DAPO order clauses', value: '5678 on 02/03/2025' },
      {
        key: "At installation what are the possible risks from the device wearer's behaviour?",
        value: 'Violent behaviour or threats of violence',
      },
      {
        key: 'What are the possible risks at the installation address? (optional)',
        value: 'Safeguarding child',
      },
      {
        key: 'Any other risks to be aware of? (optional)',
        value: 'some details',
      },
    ])
  })
  it('Notifying organisation is Home Office, skips to risk at installation', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'HOME_OFFICE'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Home Office', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    const detailsOfInstallationPage = Page.verifyOnPage(DetailsOfInstallationPage)
    detailsOfInstallationPage.form.fillInWith(detailsOfInstallation)
    detailsOfInstallationPage.form.saveAndContinueButton.click()
    const isMappaPage = Page.verifyOnPage(IsMappaPage)
    isMappaPage.form.fillInWith({ isMappa: 'No' })
    isMappaPage.form.saveAndContinueButton.click()
    const cyaPage = Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answer')
    cyaPage.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    cyaPage.installationRiskSection.shouldNotHaveItem(
      'Any other information to be aware of about the offence committed?',
    )
    cyaPage.installationRiskSection.shouldNotHaveItem('Offences')
  })

  it('Should able to delete dapo', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Family Court', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    // Should go to dapo and date page
    let dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.fillInWith({ dapoClauseNumber: '1234', dapoDate: new Date(2025, 1, 1) })
    dapoPage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
    offenceList.form.summaryList.shouldHaveItem('1234', 'on 01/02/2025')
    offenceList.form.fillInWith({ addDapoClause: 'Yes' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to dapo and date page
    dapoPage = Page.verifyOnPage(DapoPage)
    dapoPage.form.fillInWith({ dapoClauseNumber: '5678', dapoDate: new Date(2025, 2, 2) })
    dapoPage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
    offenceList.form.summaryList.shouldHaveItem('1234', 'on 01/02/2025')
    offenceList.form.summaryList.shouldHaveItem('5678', 'on 02/03/2025')
    offenceList.actionLinkByLabel('1234', 'Delete').click()
    // Should go to offence list delete page
    const offenceListDeletePage = Page.verifyOnPage(OffenceDeletePage)
    offenceListDeletePage.confirmDeleteButton().click()
    // Should go to offence add to list page
    Page.verifyOnPage(OffenceListPage, undefined, undefined, 'DAPO order clauses')
    offenceList.form.summaryList.shouldNotHaveItem('1234')
    offenceList.form.summaryList.shouldHaveItem('5678', 'on 02/03/2025')
  })

  it('Should able to delete offence', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'COURT'],
    })
    cy.signIn()

    createNewOrder({
      notifyingOrganisation: createFakeInterestedParties('Civil and County Court', 'Prison', undefined, 'North West'),
    })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.aboutTheDeviceWearerTask.click()

    orderSummaryPage.fillInGeneralOrderDetailsWith({
      deviceWearerDetails,
      newDeviceWearerFlow: true,
    })

    const offences = [
      { offenceType: 'Criminal damage and arson', offenceDate: new Date(2025, 1, 1) },
      { offenceType: 'Sexual offences', offenceDate: new Date(2025, 2, 2) },
    ]

    // Should go to offence page
    let offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith(offences[0])
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    let offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.summaryList.shouldHaveItem('Criminal damage and arson', 'on 01/02/2025')
    offenceList.form.fillInWith({ addOffence: 'Yes' })
    offenceList.form.saveAndContinueButton.click()
    // Should go to offence page
    offencePage = Page.verifyOnPage(OffencePage)
    offencePage.form.fillInWith(offences[1])
    offencePage.form.saveAndContinueButton.click()
    // Should go to offence add to list page
    offenceList = Page.verifyOnPage(OffenceListPage)
    offenceList.form.summaryList.shouldHaveItem('Criminal damage and arson', 'on 01/02/2025')
    offenceList.form.summaryList.shouldHaveItem('Sexual offences', 'on 02/03/2025')
    offenceList.actionLinkByLabel('Criminal damage and arson', 'Delete').click()
    // Should go to offence list delete page
    const offenceListDeletePage = Page.verifyOnPage(OffenceDeletePage)
    offenceListDeletePage.confirmDeleteButton().click()
    // Should go to offence add to list page
    Page.verifyOnPage(OffenceListPage, undefined, undefined, 'Offences committed')
    offenceList.form.summaryList.shouldNotHaveItem('Criminal damage and arson')
    offenceList.form.summaryList.shouldHaveItem('Sexual offences', 'on 02/03/2025')
  })
})
