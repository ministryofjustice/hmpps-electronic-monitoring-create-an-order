import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'

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
      pdu: 'mock',
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    // TODO veriry check your answers
  })

  it('Notifying organisation is Home Office and responsible organisation is Home Office', () => {
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Home Office',
        notifyingOrganisationEmailAddress: 'a@b.com',
      },
      responsibleOfficer: 'mock',
      responsibleOrganisation:  {
          responsibleOrganisation: 'Home Office',
          responsibleOrganisationEmailAddress: 'a@b.com',
      },
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    // TODO veriry check your answers
  })

  it('Notifying organisation is prison and resonsible organisation is probation', () => {
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      },
      responsibleOfficer: 'mock',
      responsibleOrganisation: {
          responsibleOrganisation: 'Probation',
          probationRegion: 'Wales'
      },
      pdu: 'mock',
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
    // TODO veriry check your answers
  })
})
