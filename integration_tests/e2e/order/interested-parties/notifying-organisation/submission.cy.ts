import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import NotifyingOrganisationPage from './notifyingOrganisationPage'
import OrderTasksPage from '../../../../pages/order/summary'
import mockApiOrder from '../../../../utils/data/ApiOrder'

const mockOrderId = uuidv4()
context('Submit notifying organisations', () => {
  const submitPath = '/interested-parties'
  context('New orders', () => {
    beforeEach(() => {
      cy.task('reset')
      const mockOrder = mockApiOrder()
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV6',
        },
      })

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: submitPath,
        method: 'PUT',
        response: {
          notifyingOrganisation: 'PRISON',
          responsibleOrganisation: 'PROBATION',
        },
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrder.id,
      })
    })

    it('should  routes summary page', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456780',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC' },
      })

      cy.signIn()

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
      Page.verifyOnPage(OrderTasksPage)
    })

    it('other cohort can submit order', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456784',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'OTHER' },
      })

      cy.signIn()

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
      Page.verifyOnPage(OrderTasksPage)
    })

    it('court cohort can submit notifying organisation and route to summary page', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456781',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'COURT' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Family Court',
        familyCourt: 'Swansea Family Court',
        notifyingOrganisationEmailAddress: 'a@b.com',
      })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${submitPath}`,
        body: {
          notifyingOrganisation: 'FAMILY_COURT',
          notifyingOrganisationName: 'SWANSEA_FAMILY_COURT',
          notifyingOrganisationEmail: 'a@b.com',
        },
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })

    it('probation can submit notifying organisation and route to summary page', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456782',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PROBATION' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisationEmailAddress: 'a@b.com',
      })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${submitPath}`,
        body: {
          notifyingOrganisation: 'PROBATION',
          notifyingOrganisationName: '',
          notifyingOrganisationEmail: 'a@b.com',
        },
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })

    it('home office notifying organisation and route to summary page', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456783',
      })

      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'HOME_OFFICE' },
      })

      cy.signIn()

      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisationEmailAddress: 'homeoffice@homeoffice.com',
      })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${submitPath}`,
        body: {
          notifyingOrganisation: 'HOME_OFFICE',
          notifyingOrganisationName: '',
          notifyingOrganisationEmail: 'homeoffice@homeoffice.com',
        },
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })
  })

  context('Variation', () => {
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

    it('monitoring start date is in the past, should submit interested parties and go to summary page', () => {
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

      Page.verifyOnPage(OrderTasksPage)
    })

    it('monitoring start date is in the future, not a court routes to summary page', () => {
      const startDate = new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days after today
      stubVariationOrder(startDate)
      stubPutInterestedParties()
      const page = Page.visit(NotifyingOrganisationPage, { orderId: mockOrderId })

      page.form.fillInWith({
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      })
      page.form.continueButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })
  })
})
