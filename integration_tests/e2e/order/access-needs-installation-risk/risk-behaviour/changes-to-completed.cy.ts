import Page from '../../../../pages/page'
import ConfirmVariationPage from '../../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../../pages/order/summary'
import InstallationAndRiskCheckRiskPage from '../../../../pages/order/installation-and-risk/check-risk'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'
import RiskAtAddressPage from '../risk-at-address/RiskAtAddressPage'
import RiskBehaviourPage from './RiskBehaviourPage'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVariationId = '11a11111-79cd-49f9-a498-b1f07c543b8a'
const mockUncachedVersionId = '33a33333-79cd-49f9-a498-b1f07c543b8a'
const mockOffenceId = '22a22222-79cd-49f9-a498-b1f07c543b8a'

const daysAgo = (days: number) => new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * days).setHours(0, 0, 0, 0))

const completedRiskInformation = {
  interestedParties: {
    notifyingOrganisation: 'PRISON',
    notifyingOrganisationName: 'ALTCOURSE_PRISON',
    notifyingOrganisationEmail: 'notifying@organisation',
  },
  detailsOfInstallation: { riskCategory: ['THREATS_OF_VIOLENCE'], riskDetails: '', genderRiskDetails: '' },
  offences: [{ id: mockOffenceId, offenceType: 'SEXUAL_OFFENCES', offenceDate: daysAgo(400).toISOString() }],
  offenceAdditionalDetails: { additionalDetails: 'details' },
}

context('Making changes to a previously submitted order', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOriginalId, status: 'SUBMITTED' })
    cy.task('stubCemoCreateVariation', {
      httpStatus: 200,
      originalId: mockOriginalId,
      variationId: mockVariationId,
    })
    cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOriginalId })
    cy.signIn()
  })

  it('shows Risk information as Incomplete on the order list page', () => {
    cy.visit(`/order/${mockOriginalId}/edit`)
    const confirmPage = Page.verifyOnPage(ConfirmVariationPage)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      order: { ...completedRiskInformation, fmsResultDate: daysAgo(32) },
    })

    confirmPage.confirmButton().click()

    const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
    orderTasksPage.riskInformationTask.shouldHaveStatus('Incomplete')
  })

  const goToCheckRiskPage = () => {
    cy.visit(`/order/${mockOriginalId}/edit`)
    const confirmPage = Page.verifyOnPage(ConfirmVariationPage)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      order: { ...completedRiskInformation, fmsResultDate: daysAgo(32) },
    })

    confirmPage.confirmButton().click()

    Page.verifyOnPage(OrderTasksPage).riskInformationTask.click()
    return Page.verifyOnPage(InstallationAndRiskCheckRiskPage)
  }

  it('Shows the Check Risk page when the user clicks on the Risk Information Section', () => {
    goToCheckRiskPage()
  })

  it('goes to the normal risk assessment journey when the user answers Yes', () => {
    const page = goToCheckRiskPage()

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    Page.verifyOnPage(RiskBehaviourPage)
  })

  it('goes to the check your answers page when the user answers No', () => {
    const page = goToCheckRiskPage()

    page.form.fillInWith('No')
    page.form.continueButton.click()

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOriginalId }, {}, 'Check your answers')
  })

  it('goes through the risk journey when the user answers Yes and continues', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      subPath: '/details-of-installation',
      response: completedRiskInformation.detailsOfInstallation,
    })
    const page = goToCheckRiskPage()

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    const riskBehaviourPage = Page.verifyOnPage(RiskBehaviourPage)
    riskBehaviourPage.form.fillInWith('Sex offender')
    riskBehaviourPage.form.continueButton.click()

    Page.verifyOnPage(RiskAtAddressPage)
  })

  it('shows Risk information as Complete on the order list page once the question is answered', () => {
    const page = goToCheckRiskPage()

    page.form.fillInWith('No')
    page.form.continueButton.click()

    const checkYourAnswersPage = Page.verifyOnPage(
      InstallationAndRiskCheckYourAnswersPage,
      { orderId: mockOriginalId },
      {},
      'Check your answers',
    )
    checkYourAnswersPage.return()

    Page.verifyOnPage(OrderTasksPage).riskInformationTask.shouldHaveStatus('Complete')
  })

  it('does not show the Check Risk page again once it has been answered', () => {
    const page = goToCheckRiskPage()

    page.form.fillInWith('No')
    page.form.continueButton.click()

    Page.verifyOnPage(
      InstallationAndRiskCheckYourAnswersPage,
      { orderId: mockOriginalId },
      {},
      'Check your answers',
    ).return()

    Page.verifyOnPage(OrderTasksPage).riskInformationTask.click()

    cy.url().should('not.include', 'check-risk')
    cy.get('h1').should('not.contain', "Check if the device wearer's risk has changed")
  })

  it('marks Risk information as Incomplete again, and shows the Check Risk page, once the cached answer is gone', () => {
    const page = goToCheckRiskPage()

    page.form.fillInWith('No')
    page.form.continueButton.click()
    Page.verifyOnPage(
      InstallationAndRiskCheckYourAnswersPage,
      { orderId: mockOriginalId },
      {},
      'Check your answers',
    ).return()
    Page.verifyOnPage(OrderTasksPage).riskInformationTask.shouldHaveStatus('Complete')

    // The answer is cached against order id + version id, so a different version id is a cache miss
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      order: { ...completedRiskInformation, fmsResultDate: daysAgo(32), versionId: mockUncachedVersionId },
    })
    cy.reload()

    const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
    orderTasksPage.riskInformationTask.shouldHaveStatus('Incomplete')
    orderTasksPage.riskInformationTask.click()
    Page.verifyOnPage(InstallationAndRiskCheckRiskPage)
  })
})
