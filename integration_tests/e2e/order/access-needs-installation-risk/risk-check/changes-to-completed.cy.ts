import Page from '../../../../pages/page'
import ConfirmVariationPage from '../../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../../pages/order/summary'
import InstallationAndRiskCheckRiskPage from '../../../../pages/order/installation-and-risk/check-risk'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'
import OtherRisksPage from '../other-risks/OtherRisksPage'
import RiskAtAddressPage from '../risk-at-address/RiskAtAddressPage'
import RiskBehaviourPage from '../risk-behaviour/RiskBehaviourPage'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVariationId = '11a11111-79cd-49f9-a498-b1f07c543b8a'
const mockUncachedVersionId = '33a33333-79cd-49f9-a498-b1f07c543b8a'
const mockOffenceId = '22a22222-79cd-49f9-a498-b1f07c543b8a'

const daysAgo = (days: number) => new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * days).setHours(0, 0, 0, 0))

const fullyAnsweredDetailsOfInstallation = {
  riskCategory: ['THREATS_OF_VIOLENCE', 'DANGEROUS_ANIMALS'],
  riskDetails: 'Some other risk',
  genderRiskDetails: '',
}

function getMockedMonitoringConditions(mockDate = new Date(2000, 10, 20).toISOString()) {
  return {
    orderType: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    orderTypeDescription: null,
    conditionType: null,
    startDate: mockDate,
    endDate: mockDate,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
    pilot: null,
    dapolMissedInError: null,
    offenceType: null,
    isValid: false,
  }
}

const completedRiskInformation = {
  interestedParties: {
    notifyingOrganisation: 'PROBATION',
    notifyingOrganisationName: 'ALTCOURSE_PRISON',
    notifyingOrganisationEmail: 'notifying@organisation',
  },
  detailsOfInstallation: { riskCategory: ['THREATS_OF_VIOLENCE'], riskDetails: '', genderRiskDetails: '' },
  offences: [{ id: mockOffenceId, offenceType: 'SEXUAL_OFFENCES', offenceDate: daysAgo(400).toISOString() }],
  offenceAdditionalDetails: { additionalDetails: 'details' },
}

context('Making changes to a previously submitted order as a Probation user', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoRequest', {
      httpStatus: 200,
      method: 'GET',
      subPath: 'user-cohort',
      response: { cohort: 'PROBATION', activeCaseLoad: 'Probation Test' },
    })
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
      order: {
        ...completedRiskInformation,
        monitoringConditions: getMockedMonitoringConditions(),
        fmsResultDate: daysAgo(32),
      },
    })

    confirmPage.confirmButton().click()

    const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
    orderTasksPage.riskInformationTask.shouldHaveStatus('Incomplete')
  })

  const goToCheckRiskPage = (orderOverrides: object = {}) => {
    cy.visit(`/order/${mockOriginalId}/edit`)
    const confirmPage = Page.verifyOnPage(ConfirmVariationPage)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      order: {
        ...completedRiskInformation,
        monitoringConditions: getMockedMonitoringConditions(),
        fmsResultDate: daysAgo(32),
        ...orderOverrides,
      },
    })

    confirmPage.confirmButton().click()

    Page.verifyOnPage(OrderTasksPage).riskInformationTask.click()
    return Page.verifyOnPage(InstallationAndRiskCheckRiskPage)
  }

  it('Shows the Check Risk page when the user clicks on the Risk Information Section', () => {
    goToCheckRiskPage()
  })

  it('Does not show the Check Risk page when the user clicks on the Risk Information Section when the order start date is in the future', () => {
    cy.visit(`/order/${mockOriginalId}/edit`)
    Page.verifyOnPage(ConfirmVariationPage)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'VARIATION',
      order: {
        ...completedRiskInformation,
        monitoringConditions: getMockedMonitoringConditions(new Date(3000, 10, 20).toISOString()),
        fmsResultDate: daysAgo(32),
      },
    })
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

  it('asks the address and other risk questions after Yes, even when the order already has answers for them', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      subPath: '/details-of-installation',
      response: fullyAnsweredDetailsOfInstallation,
    })
    const page = goToCheckRiskPage({
      dataDictionaryVersion: 'DDV6',
      detailsOfInstallation: fullyAnsweredDetailsOfInstallation,
    })

    page.form.fillInWith('Yes')
    page.form.continueButton.click()

    const riskBehaviourPage = Page.verifyOnPage(RiskBehaviourPage)
    riskBehaviourPage.form.fillInWith('Sex offender')
    riskBehaviourPage.form.continueButton.click()

    Page.verifyOnPage(RiskAtAddressPage).form.continueButton.click()

    Page.verifyOnPage(OtherRisksPage).form.continueButton.click()

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOriginalId }, {}, 'Check your answers')
  })

  it('shows Risk information as Complete on the order list page once the question is answered for a REINSTALL_AT_DIFFERENT_ADDRESS', () => {
    cy.visit(`/order/${mockOriginalId}/edit`)
    const confirmPage = Page.verifyOnPage(ConfirmVariationPage)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOriginalId,
      status: 'IN_PROGRESS',
      type: 'REINSTALL_AT_DIFFERENT_ADDRESS',
      order: {
        ...completedRiskInformation,
        monitoringConditions: getMockedMonitoringConditions(),
        fmsResultDate: daysAgo(32),
      },
    })

    confirmPage.confirmButton().click()

    Page.verifyOnPage(OrderTasksPage).riskInformationTask.click()
    const page = Page.verifyOnPage(InstallationAndRiskCheckRiskPage)

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
      order: {
        ...completedRiskInformation,
        monitoringConditions: getMockedMonitoringConditions(),
        fmsResultDate: daysAgo(32),
        versionId: mockUncachedVersionId,
      },
    })
    cy.reload()

    const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
    orderTasksPage.riskInformationTask.shouldHaveStatus('Incomplete')
    orderTasksPage.riskInformationTask.click()
    Page.verifyOnPage(InstallationAndRiskCheckRiskPage)
  })
})

function testSetup(cohort: string) {
  cy.task('reset')
  cy.task('stubSignIn', { name: 'test user', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
  cy.task('stubCemoRequest', {
    httpStatus: 200,
    method: 'GET',
    subPath: 'user-cohort',
    response: { cohort, activeCaseLoad: 'Probation Test' },
  })
  cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOriginalId, status: 'SUBMITTED' })
  cy.task('stubCemoCreateVariation', {
    httpStatus: 200,
    originalId: mockOriginalId,
    variationId: mockVariationId,
  })
  cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOriginalId })
  cy.signIn()
}

const nonProbationCohorts = [
  { cohort: 'PRISON', label: 'a Prison' },
  { cohort: 'HOME_OFFICE', label: 'a Home Office' },
  { cohort: 'COURT', label: 'a Court' },
  { cohort: 'OTHER', label: 'an Other' },
]

context('Making changes to a previously submitted order as a non Probation user', () => {
  nonProbationCohorts.forEach(({ cohort, label }) => {
    it(`Should not see the Check Risk page when signed in as ${label} user`, () => {
      testSetup(cohort)
      cy.visit(`/order/${mockOriginalId}/edit`)
      const confirmPage = Page.verifyOnPage(ConfirmVariationPage)

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOriginalId,
        status: 'IN_PROGRESS',
        type: 'VARIATION',
        order: {
          ...completedRiskInformation,
          monitoringConditions: getMockedMonitoringConditions(),
          fmsResultDate: daysAgo(32),
        },
      })

      confirmPage.confirmButton().click()

      const orderTasksPage = Page.verifyOnPage(OrderTasksPage)
      orderTasksPage.riskInformationTask.shouldHaveStatus('Optional')
      orderTasksPage.riskInformationTask.click()
      Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOriginalId }, {}, 'Check your answers')
    })
  })
})
