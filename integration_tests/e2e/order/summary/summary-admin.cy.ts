import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../../pages/order/summary'
import ErrorPage from '../../../pages/error'
import Page from '../../../pages/page'
import mockApiOrder from '../../../utils/data/ApiOrder'

const mockOrderId = uuidv4()

context('Order Summary', () => {
  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Page not found')
    })
  })
  context('Complete order, home office', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          submittedBy: 'John Smith',
          fmsResultDate: new Date(2028, 0, 1, 10, 30, 0, 0),
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
            firstName: 'Joe',
            lastName: 'Bloggs',
            alias: null,
            dateOfBirth: null,
            adultAtTimeOfInstallation: false,
            sex: null,
            gender: null,
            disabilities: '',
            noFixedAbode: false,
            interpreterRequired: null,
          },
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },

          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: '',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            responsibleOrganisationEmail: '',
            responsibleOrganisationPhoneNumber: '',
            responsibleOrganisationRegion: '',
          },
          enforcementZoneConditions: [
            {
              description: null,
              duration: null,
              endDate: null,
              fileId: null,
              fileName: null,
              startDate: null,
              zoneId: null,
              zoneType: null,
            },
          ],
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'SECONDARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'TERTIARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'INSTALLATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
          ],
          additionalDocuments: [],
          monitoringConditions: {
            orderType: null,
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
            pilot: null,
            isValid: true,
            offenceType: null,
          },
          monitoringConditionsTrail: { startDate: null, endDate: null },
          monitoringConditionsAlcohol: {
            endDate: null,
            installationLocation: null,
            monitoringType: null,
            prisonName: null,
            probationOfficeName: null,
            startDate: null,
          },
          isValid: false,
          mandatoryAttendanceConditions: [
            {
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              appointmentDay: null,
              endDate: null,
              endTime: null,
              postcode: null,
              purpose: null,
              startDate: null,
              startTime: null,
            },
          ],
          curfewReleaseDateConditions: {
            curfewAddress: null,
            endTime: null,
            orderId: null,
            releaseDate: null,
            startTime: null,
          },
          curfewConditions: {
            curfewAddress: null,
            endDate: null,
            orderId: null,
            startDate: null,
            curfewAdditionalDetails: null,
          },
          curfewTimeTable: [
            {
              curfewAddress: '',
              dayOfWeek: '',
              endTime: '',
              orderId: '',
              startTime: '',
            },
          ],
        },
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })
      cy.signIn()
    })

    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Home office notifying org, we dont see responsible org section', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-task-list__item')
        .contains('.govuk-task-list__name-and-hint', 'About the Responsible Organisation')
        .should('not.exist')

      page.aboutTheDeviceWearerTask.shouldHaveStatus('To check')
      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
    })
  })

  context('View only order, assign to me', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          isOwner: false,
        },
      })

      cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOrderId })
      cy.signIn()
    })

    it('shows the "Assign form to me" button for order not owned', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.assignToMeButton.should('be.visible')
    })

    it('assigns the order to the current user and returns to the summary', () => {
      cy.task('stubCemoUpdateOrderOwner', {
        httpStatus: 200,
        id: mockOrderId,
        order: { id: mockOrderId, status: 'IN_PROGRESS' },
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.assignToMeButton.click()

      Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId })
    })

    it('does not show the submit form controls while not owner', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.submitOrderButton.should('not.exist')
      page.assignToMeButton.should('be.visible')
    })
  })

  context('Sentencing act banner', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetVersions', { httpStatus: 200, versions: [], orderId: mockOrderId })
      cy.signIn()
    })

    const stubOrderWithSentencingAct = (isSentencingAct: boolean) => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: { ...mockApiOrder(), id: mockOrderId, status: 'IN_PROGRESS', isSentencingAct },
      })
    }

    it('shows the Sentencing Act message when order is flagged', () => {
      stubOrderWithSentencingAct(true)
      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.moj-alert')
        .should('contain.text', 'This order is subject to the Sentencing Act 2026 changes.')
        .and('not.have.class', 'moj-alert--warning')
        .and('have.class', 'moj-alert--information')
    })

    it('doesnt show the Sentencing Act banner when order is not sentencing act', () => {
      stubOrderWithSentencingAct(false)
      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.moj-alert').should('not.exist')
    })
  })
})
