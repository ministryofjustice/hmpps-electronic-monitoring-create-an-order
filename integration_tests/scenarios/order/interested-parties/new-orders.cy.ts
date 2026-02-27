import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'

context('Interested parties flow', () => {
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

    orderSummaryPage.interestedPartiesTask.click()
  })
  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Notifying organisation is court', () => {
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Family Court',
        notifyingOrganisationEmailAddress: 'a@b.com',
        familyCourt: 'Aberystwyth Family Court',
      },
      responsibleOrganisation: {
        responsibleOrganisation: 'Probation',
        probationRegion: 'Wales',
        responsibleOrganisationEmailAddress: 'a@b.com',
      },
      pdu: 'Dyfed Powys',
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: 'What organisation or related organisation are you part of?', value: 'Family Court' },
      { key: 'Select the name of the Family Court', value: 'Aberystwyth Family Court' },
      { key: "What is your team's contact email address?", value: 'a@b.com' },
      { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
      { key: 'Select the Probation region', value: 'Wales' },
      { key: "What is the Responsible Organisation's email address? (optional)", value: 'a@b.com' },
    ])
  })

  it('Notifying organisation is Home Office and responsible organisation is Home Office', () => {
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Home Office',
        notifyingOrganisationEmailAddress: 'a@b.com',
      },
      responsibleOfficer: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'John@Smith.com',
      },
      responsibleOrganisation: {
        responsibleOrganisation: 'Home Office',
        responsibleOrganisationEmailAddress: 'a@b.com',
      },
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
      { key: "What is your team's contact email address?", value: 'a@b.com' },
      { key: "What is the Responsible Officer's first name?", value: 'John' },
      { key: "What is the Responsible Officer's last name?", value: 'Smith' },
      { key: "What is the Responsible Officer's email address?", value: 'John@Smith.com' },
      { key: "What is the Responsible Officer's organisation?", value: 'Home Office' },
      { key: "What is the Responsible Organisation's email address? (optional)", value: 'a@b.com' },
    ])
  })

  it('Notifying organisation is prison and resonsible organisation is probation', () => {
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      },
      responsibleOfficer: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'John@Smith.com',
      },
      responsibleOrganisation: {
        responsibleOrganisation: 'Probation',
        probationRegion: 'Wales',
      },
      pdu: 'Dyfed Powys',
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: 'What organisation or related organisation are you part of?', value: 'Prison service' },
      { key: 'Select the name of the Prison', value: 'Altcourse Prison' },
      { key: "What is your team's contact email address?", value: 'a@b.com' },
      { key: "What is the Responsible Officer's first name?", value: 'John' },
      { key: "What is the Responsible Officer's last name?", value: 'Smith' },
      { key: "What is the Responsible Officer's email address?", value: 'John@Smith.com' },
      { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
      { key: 'Select the Probation region', value: 'Wales' },
    ])
  })
})
