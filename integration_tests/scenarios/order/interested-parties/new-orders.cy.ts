import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import createNewOrder from '../../../utils/scenario-flows/create-new-order.cy'

context('Interested parties flow', () => {
  let orderSummaryPage: OrderSummaryPage

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Notifying organisation is court', () => {
    cy.task('stubSignIn', {
      name: 'john smith',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'ROLE_EM_CEMO_COURT'],
      stubCohort: false,
      userId: '123456780',
    })

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

    createNewOrder({ notifyingOrganisation: input.notifyingOrganisation })

    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()

    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
      { key: 'Select the Probation region', value: 'Wales' },
      { key: "What is the Responsible Organisation's email address? (optional)", value: 'a@b.com' },
    ])
  })

  it('Notifying organisation is prison and responsible organisation is probation', () => {
    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })
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
    createNewOrder({ notifyingOrganisation: input.notifyingOrganisation })
    orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()

    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: "What is the Responsible Officer's first name?", value: 'John' },
      { key: "What is the Responsible Officer's last name?", value: 'Smith' },
      { key: "What is the Responsible Officer's email address?", value: 'John@Smith.com' },
      { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
      { key: 'Select the Probation region', value: 'Wales' },
    ])
  })
})
