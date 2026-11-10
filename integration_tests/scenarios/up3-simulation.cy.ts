import { v4 as uuidv4 } from 'uuid'
import mockApiOrder from '../utils/data/ApiOrder'
import Page from '../pages/page'
import ResponsibleOfficerPage from '../e2e/order/interested-parties/responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../e2e/order/interested-parties/responsible-organisation/responsibleOrganisationPage'
import IdentityNumbersFormComponent from '../pages/components/forms/about-the-device-wearer/identityNumbersForm'
import InstallationAppointmentPage from '../pages/order/monitoring-conditions/installation-appointment'
import RiskBehaviourPage from '../e2e/order/access-needs-installation-risk/risk-behaviour/RiskBehaviourPage'
import fillInRiskAtInstallationWith from '../utils/scenario-flows/risk-at-installation.cy'
import OffencePage from '../e2e/order/access-needs-installation-risk/offences/offence/offencePage'
import OffenceOtherInfoPage from '../e2e/order/access-needs-installation-risk/offences/offence-other-info/offenceOtherInfoPage'
import InstallationAndRiskCheckYourAnswersPage from '../pages/order/installation-and-risk/check-your-answers'
import fillInAttachmentDetailsWith from '../utils/scenario-flows/attachments'
import { stubAttachments } from './utils'

const suite = Cypress.env('up3SimulationRealApi') ? describe : describe.skip
const returnReceiptPollIntervalMs = 1000

const draftOrder = () => {
  const source = mockApiOrder()
  return {
    ...source,
    username: 'IGNORED_SMOKE_SOURCE_OWNER',
    curfewTimeTable: [],
    deviceWearer: { ...source.deviceWearer, versionId: source.versionId, firstName: 'UP3', lastName: 'Smoke Test' },
    monitoringConditions: { ...source.monitoringConditions, versionId: source.versionId },
  }
}

const awaitProcessedReturn = (url: string, attempt = 0): Cypress.Chainable<boolean> =>
  cy.request(url).then(response => {
    if (response.body.includes('Return processed.')) return cy.wrap(true, { log: false })
    if (response.body.includes('Return failed') || response.body.includes('Return ignored') || attempt >= 30) {
      throw new Error('The real return did not reach PROCESSED; inspect the retained event receipt')
    }
    return cy
      .wrap(Cypress.Promise.delay(returnReceiptPollIntervalMs), { log: false })
      .then(() => awaitProcessedReturn(url, attempt + 1))
  })

suite('UP3 simulation with the real local API', () => {
  let previousServiceRequestFlag: boolean | string
  before(() => {
    cy.readFile('data/feature-flags.json').then(flags => {
      previousServiceRequestFlag = flags.SERVICE_REQUEST_TYPE_ENABLED
      cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: false })
    })
  })
  after(() => {
    cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: previousServiceRequestFlag })
  })
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      name: 'UP3 Smoke Tester',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'ROLE_PRISON', 'PRISON_USER'],
    })
    cy.request('POST', 'http://localhost:9091/__admin/mappings', {
      request: { method: 'GET', urlPattern: '/manage-user/users/(.*)/email' },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { username: 'USER1', email: 'up3-smoke@example.com', verified: true },
      },
    })
    cy.signIn()
  })

  it('creates an editable draft with no simulated submission yet', () => {
    const order = draftOrder()
    cy.visit('/dev/up3-simulation/create')
    cy.get('#orderJson').type(JSON.stringify(order), { parseSpecialCharSequences: false, delay: 0 })
    cy.contains('button', 'Create simulated test order').click()
    cy.location('pathname').should('match', /^\/dev\/up3-simulation\/orders\/[0-9a-f-]+$/)
    cy.contains('This is an editable draft').should('be.visible')
    cy.contains('Set accepted').should('not.exist')
    cy.contains('Return order').should('not.exist')
    cy.contains('Open normal order summary').click()
    cy.contains('UP3 Smoke Test').should('be.visible')
  })

  const returnStates = ['PROCESSING', 'RETURNED'] as const
  returnStates.forEach(initialState => {
    it(`tracks a genuine rejection from initial ${initialState} without accepting first`, () => {
      const reason = `Return from ${initialState}`
      cy.visit('/dev/up3-simulation/create')
      cy.contains('Use synthetic example').click()
      cy.get(`input[name=state][value=${initialState}]`).check()
      if (initialState === 'RETURNED') {
        cy.get('#section-0').type('other')
        cy.get('#details-0').type(reason)
      }
      cy.contains('button', 'Create simulated test order').click()
      if (initialState === 'PROCESSING') {
        cy.location('pathname').then(simulationUrl => {
          cy.contains('Open normal order summary').click()
          cy.get('#make-changes-button').should('be.disabled')
          cy.visit(`${simulationUrl}/return`)
          cy.get('#section-0').type('other')
          cy.get('#details-0').type(reason)
          cy.contains('button', 'Publish return').click()
        })
      }
      cy.location('pathname')
        .should('include', '/returns/')
        .then(returnUrl => {
          awaitProcessedReturn(returnUrl)
          cy.visit(returnUrl)
          cy.contains('Return processed.').should('be.visible')
        })
      cy.contains('Inspect current simulation').click()
      cy.contains('.govuk-summary-list__key', 'CEMO status')
        .parent()
        .find('.govuk-summary-list__value')
        .should('contain.text', 'REJECTED')
      cy.contains('Open normal order summary').click()
      cy.contains('This form has been returned.').should('be.visible')
      cy.contains('Form returned').should('be.visible')
      cy.contains('View reason for return').click()
      cy.contains(reason).should('be.visible')
    })
  })

  it('processes a real return, amends and resubmits a new locked version', () => {
    cy.visit('/dev/up3-simulation/create')
    cy.contains('Use synthetic example').click()
    cy.get('#orderJson')
      .invoke('val')
      .then(value => {
        const example = JSON.parse(String(value))
        expect(example.username).to.equal('IGNORED_EXAMPLE_SOURCE_OWNER')
        expect(example.deviceWearer.versionId).to.equal(example.versionId)
      })
    cy.get('input[name=state][value=PROCESSING]').check()
    cy.contains('button', 'Create simulated test order').click()
    cy.location('pathname')
      .should('match', /^\/dev\/up3-simulation\/orders\/[0-9a-f-]+$/)
      .then(simulationUrl => {
        const orderId = simulationUrl.split('/').at(-1)
        cy.visit('/dev/up3-simulation')
        cy.get('#orderId').type(`http://localhost:8080/api/orders/${orderId}`)
        cy.contains('button', 'Inspect order').click()
        cy.location('pathname').should('eq', simulationUrl)
        cy.contains('Open normal order summary').click()
        cy.get('#make-changes-button').should('be.disabled')
        cy.visit(simulationUrl)
        cy.contains('button', 'Set accepted').click()
        cy.contains('AWAITING_VALIDATION').should('be.visible')
        cy.contains('Open normal order summary').click()
        cy.get('#make-changes-button').should('have.attr', 'href', `/order/${orderId}/edit`)
        cy.contains('Form accepted').should('be.visible')
        cy.visit(`${simulationUrl}/return`)
        cy.get('input[name=expectedCurrentOrderVersionId]')
          .invoke('val')
          .should('match', /^[0-9a-f-]{36}$/)
          .as('submittedVersion', { type: 'static' })
        cy.get('#section-0').type('other')
        cy.get('#details-0').type('Local queue smoke test')
        cy.contains('button', 'Publish return').click()
        cy.location('pathname')
          .should('include', '/returns/')
          .then(returnUrl => {
            cy.wrap(returnUrl).as('returnReceiptUrl')
            awaitProcessedReturn(returnUrl)
            cy.visit(returnUrl)
            cy.contains('Return processed.').should('be.visible')
          })
        cy.visit(`/order/${orderId}/summary`)
        cy.contains('This form has been returned.').should('be.visible')
        cy.contains('Form returned').should('be.visible')
        cy.contains('View reason for return').click()
        cy.contains('Local queue smoke test').should('be.visible')
        cy.visit(simulationUrl)
        cy.contains('.govuk-summary-list__key', 'Captured user notifications')
          .parent()
          .find('.govuk-summary-list__value')
          .should('contain.text', '1')
        cy.contains('.govuk-summary-list__key', 'Captured notifying-organisation notifications')
          .parent()
          .find('.govuk-summary-list__value')
          .should('contain.text', '1')
        cy.visit(`/order/${orderId}/summary`)
        cy.get('#make-changes-button').click()
        cy.get('#confirm-button').click()
        cy.visit(simulationUrl)
        cy.contains('This is an editable draft').should('be.visible')
        cy.contains('Set accepted').should('not.exist')
        cy.contains('Return order').should('not.exist')
        cy.get('@submittedVersion').then(previousVersion => {
          cy.contains('.govuk-summary-list__key', 'Current version UUID')
            .parent()
            .find('.govuk-summary-list__value')
            .invoke('text')
            .then(currentVersion => {
              expect(currentVersion.trim()).not.to.equal(previousVersion)
            })
          cy.contains('.govuk-summary-list__key', 'Simulated submission UUID')
            .parent()
            .find('.govuk-summary-list__value')
            .should('contain.text', previousVersion)
        })
        cy.contains('Open normal order summary').click()
        Page.visit(ResponsibleOfficerPage, { orderId }).form.fillInWith({
          firstName: 'Smoke',
          lastName: 'Tester',
          email: 'up3-ro@example.com',
        })
        Page.verifyOnPage(ResponsibleOfficerPage).form.continueButton.click()
        cy.location('pathname').should('not.include', '/responsible-officer')
        Page.verifyOnPage(ResponsibleOrganisationPage).form.fillInWith({
          responsibleOrganisation: 'Probation',
          probationRegion: 'London',
        })
        Page.verifyOnPage(ResponsibleOrganisationPage).form.continueButton.click()
        cy.location('pathname').should('not.include', '/responsible-organisation')
        cy.visit(`/order/${orderId}/about-the-device-wearer/identity-numbers`)
        const identityForm = new IdentityNumbersFormComponent(['nomisId'])
        identityForm.fillInWith({ nomisId: 'A1234AB' })
        identityForm.saveAndContinueButton.click()
        Page.visit(InstallationAppointmentPage, { orderId }).form.fillInWith({
          placeName: 'Smoke Test Installation',
          appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          appointmentTimeDetails: 'Any time between 9am and 5pm on the following day',
        })
        Page.verifyOnPage(InstallationAppointmentPage).form.saveAndContinueButton.click()
        cy.location('pathname').should('not.include', '/installation-appointment')
        Page.visit(RiskBehaviourPage, { orderId })
        fillInRiskAtInstallationWith({
          possibleRisk: ['There are no risks that the installer should be aware of'],
          riskCategory: ['No risk at the address'],
        })
        Page.verifyOnPage(OffencePage).form.fillInWith({ offenceType: 'Fraud Offences' })
        Page.verifyOnPage(OffencePage).form.saveAndContinueButton.click()
        Page.verifyOnPage(OffenceOtherInfoPage).form.fillInWith({ hasOtherInformation: 'No' })
        Page.verifyOnPage(OffenceOtherInfoPage).form.saveAndContinueButton.click()
        Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').returnButton().click()
        const files = { licence: { contents: 'cypress/fixtures/test.pdf', fileName: 'test.pdf' } }
        stubAttachments(files, uuidv4(), uuidv4())
        cy.visit(`/order/${orderId}/attachments/licence`)
        fillInAttachmentDetailsWith({ files })
        ;['About the Responsible Organisation', 'About the device wearer', 'Electronic monitoring conditions'].forEach(
          section => {
            cy.contains('a', section).click()
            cy.contains('h1', 'Check your answers').should('be.visible')
            cy.get('[value="back"]').click()
            cy.location('pathname').should('eq', `/order/${orderId}/summary`)
          },
        )
        cy.contains('button', 'Submit form').should('be.enabled').click()
        cy.location('pathname').should('include', '/submit/success')
        cy.visit(simulationUrl)
        cy.contains('button', 'Set accepted').should('be.visible')
        cy.get('@submittedVersion').then(previousVersion => {
          cy.get('input[name=expectedCurrentOrderVersionId]').should('not.have.value', previousVersion)
          cy.get('input[name=expectedSimulatedSubmissionVersionId]').should('not.have.value', previousVersion)
        })
        cy.contains('Open normal order summary').click()
        cy.get('#make-changes-button').should('be.disabled')
        cy.get('@returnReceiptUrl').then(returnUrl => {
          cy.visit(String(returnUrl))
          cy.contains('Return processed.').should('be.visible')
          cy.get('@submittedVersion').then(previousVersion => {
            cy.contains('.govuk-summary-list__key', 'Target version UUID')
              .parent()
              .find('.govuk-summary-list__value')
              .should('contain.text', previousVersion)
          })
        })
      })
  })
})
