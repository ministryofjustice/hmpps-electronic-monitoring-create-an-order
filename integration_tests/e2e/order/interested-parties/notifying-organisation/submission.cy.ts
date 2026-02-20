import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'
import ResponsibleOfficerPage from '../responsible-officer/responsibleOfficerPage'
import ResponsibleOrganisationPage from '../responsible-organisation/responsibleOrganisationPage'
import InterestedPartiesCheckYourAnswersPage from '../check-your-answers/interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('Submit notifying organisations', () => {
  context('New orders', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          dataDictionaryVersion: 'DDV6',
        },
      })
      cy.signIn()
    })

    it('not a court routes to responsbile office page', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      })
      page.form.continueButton.click()

      Page.verifyOnPage(ResponsibleOfficerPage)
    })

    it('a court routes to responsbile organisation page', () => {
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Family Court',
        notifyingOrganisationEmailAddress: 'a@b.com',
        familyCourt: 'Aberystwyth Family Court',
      })
      page.form.continueButton.click()

      Page.verifyOnPage(ResponsibleOrganisationPage)
    })

    it('navigating back to the page after submission shows values without org name', () => {
      let page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Scottish Court',
        notifyingOrganisationEmailAddress: 'a@b.com',
      })
      page.form.continueButton.click()

      Page.verifyOnPage(ResponsibleOrganisationPage)

      page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
      page.form.organisationField.shouldHaveValue('Scottish Court')
      page.form.emailField.shouldHaveValue('a@b.com')
    })

    it('navigating back to the page after submission shows values with org name', () => {
      let page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      })
      page.form.continueButton.click()

      page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })
      page.form.organisationField.shouldHaveValue('Prison service')
      page.form.emailField.shouldHaveValue('a@b.com')
      page.form.prisonField.shouldHaveValue('ALTCOURSE_PRISON')
    })
  })

  context('Variation', () => {
    const submitPath = '/interested-parties'
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    const stubVariationOrder = (startDate: Date) => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        type: 'VARIATION',
        order: {
          dataDictionaryVersion: 'DDV6',
          monitoringConditions: {
            startDate,
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: '',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
            pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
            offenceType: '',
          },
        },
      })
    }

    const stubPutInterestedParties = () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: submitPath,
        method: 'PUT',
        response: {
          notifyingOrganisation: 'PRISON',
        },
      })
    }

    it('monitoring start date is in the past, should submit interested parties and go to check your answers page', () => {
      const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days before today
      stubVariationOrder(startDate)
      stubPutInterestedParties()
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${submitPath}`,
        body: {
          notifyingOrganisation: 'PRISON',
          notifyingOrganisationName: 'ALTCOURSE_PRISON',
          notifyingOrganisationEmail: 'a@b.com',
        },
      }).should('be.true')

      Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    })

    it('monitoring start date is in the future, not a court routes to responsbile office page', () => {
      const startDate = new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days after today
      stubVariationOrder(startDate)
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      })
      page.form.continueButton.click()

      Page.verifyOnPage(ResponsibleOfficerPage)
    })
  })
})
