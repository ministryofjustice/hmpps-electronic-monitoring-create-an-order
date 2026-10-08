import { v4 as uuidv4 } from 'uuid'
import SearchPage from '../pages/search'
import Page from '../pages/page'
import IndexPage from '../pages'
import IsAddressChangePage from './order/edit-order/is-address-change/isAddressChangePage'
import NotifyingOrganisationPage from './order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import mockApiOrder from '../utils/data/ApiOrder'
import OrderTasksPage from '../pages/order/summary'

const mockOrderId = uuidv4()

const basicOrder = mockApiOrder()

context('Search', () => {
  context('Searching for submitted orders', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoSearchOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Should render the correct elements ', () => {
      const page = Page.visit(SearchPage)

      // Header
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      // Create buttons
      page.newOrderFormButton.should('exist')

      page.searchHint.contains("Enter the device wearer's full name or personal identity number.")
      page.searchHint.contains('For example Bob Smith C4365JN.')

      page.subNav.should('exist')
      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)
      page.subNav.contains('Draft forms').should('not.have.attr', 'aria-current', 'page')
      page.subNav.contains('Search for a form').should('have.attr', 'href', `/search`)
      page.subNav.contains('Search for a form').should('have.attr', 'aria-current', `page`)

      // Search
      page.searchButton.should('exist')
      page.searchBox.should('exist')

      // Details
      page.detailsSummary.contains("What's a personal identity number?")
      page.detailsSummary.click()
      page.detailsList.contains('National Offender Management Information System (NOMIS)')
      page.detailsList.contains('Police National Computer (PNC)')
      page.detailsList.contains('Case Reference Number (CRN)')
      page.detailsList.contains('Prison Number')
      page.detailsList.contains('Compliance and Enforcement Person Reference (CEPR)')
      page.detailsList.contains('Court Case Reference Number (CCRN)')
    })

    it('should navigate to index when the draft forms nav link is clicked', () => {
      const page = Page.visit(SearchPage)

      page.subNav.contains('Draft forms').click()

      Page.verifyOnPage(IndexPage)
    })

    it('should navigate to search page when the Search for a form nav link is clicked', () => {
      const page = Page.visit(SearchPage)

      page.subNav.contains('Search for a form').click()

      Page.verifyOnPage(SearchPage)
    })

    it('should show a message when the search button is clicked without input', () => {
      const page = Page.visit(SearchPage)

      page.searchButton.click()

      page.ordersList.contains('You have not entered any search terms')
      page.ordersList.contains("Try searching using the device wearer's:")
      page.ordersList.contains('first name and surname')
      page.ordersList.contains('personal ID number')
      page.ordersList.contains('full name and personal ID number')
      page.ordersList.contains('Check spelling is correct and numbers are in the right place.')

      // Details
      page.detailsSummary.contains("What's a personal identity number?")
      page.detailsSummary.click()
      page.detailsList.contains('National Offender Management Information System (NOMIS)')
      page.detailsList.contains('Police National Computer (PNC)')
      page.detailsList.contains('Case Reference Number (CRN)')
      page.detailsList.contains('Prison Number')
      page.detailsList.contains('Compliance and Enforcement Person Reference (CEPR)')
      page.detailsList.contains('Court Case Reference Number (CCRN)')
    })

    it('should show a message when there are no results', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.ordersList.contains("No results found for 'Unknown name'")
      page.ordersList.contains('Check spelling is correct and numbers are in the right place.')
      page.ordersList.contains("Try searching using the device wearer's personal ID number, full name or both.")
      page.ordersList.contains("Can't find what you are looking for?")
      page.ordersList.contains(
        'If the form is not listed in the search results, it may be an emailed form so not available online.',
      )

      page.detailsSummary.should('not.exist')
    })

    it('should show "Tell us about a change.." button when there are no results', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })

      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.variationFormButton.should('exist').should('contain.text', 'Tell us about a change to a form sent by email')
      page.variationFormButton.click()
      Page.verifyOnPage(NotifyingOrganisationPage)
    })

    context('Service Request Type Enabled', () => {
      const testFlags = { SERVICE_REQUEST_TYPE_ENABLED: true }
      beforeEach(() => {
        cy.task('setFeatureFlags', testFlags)
      })
      afterEach(() => {
        cy.task('resetFeatureFlags')
      })
      it('should show "Tell us about a change.." button when there are no results and go to service request type page', () => {
        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })

        const page = Page.visit(SearchPage)

        page.searchBox.type('Unknown name')
        page.searchButton.click()

        page.variationFormButton
          .should('exist')
          .should('contain.text', 'Tell us about a change to a form sent by email')
        page.variationFormButton.click()
        Page.verifyOnPage(IsAddressChangePage)
      })
    })

    it('should create a new variation order when the "Tell us about.." button is clicked', () => {
      cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
      const page = Page.visit(SearchPage)

      page.searchBox.type('Unknown name')
      page.searchButton.click()

      page.variationFormButton.click()

      Page.verifyOnPage(NotifyingOrganisationPage)
    })

    describe('Some sections are optional depending on notifying org when "Tell us about.." button is clicked', () => {
      const testFlags = { SERVICE_REQUEST_TYPE_ENABLED: true }

      beforeEach(() => {
        cy.task('reset')
        cy.task('setFeatureFlags', testFlags)
      })

      afterEach(() => {
        cy.task('resetFeatureFlags')
      })

      it('risk information and additional documents sections are optional for home office', () => {
        const mockHomeOfficeOrderID = uuidv4()

        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
          stubCohort: false,
          userId: mockHomeOfficeOrderID,
        })

        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: 'user-cohort',
          response: { cohort: 'HOME_OFFICE', activeCaseload: 'Home Office Test' },
        })

        cy.task('stubCemoCreateOrder', {
          httpStatus: 200,
          id: mockHomeOfficeOrderID,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
        })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockHomeOfficeOrderID, status: 'IN_PROGRESS' })
        cy.signIn()

        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
        const page = Page.visit(SearchPage)

        page.searchBox.type('Unknown name')
        page.searchButton.click()

        page.variationFormButton
          .should('exist')
          .should('contain.text', 'Tell us about a change to a form sent by email')
        page.variationFormButton.click()
        Page.verifyOnPage(IsAddressChangePage)

        const isAddressChangePage = Page.visit(IsAddressChangePage)

        isAddressChangePage.form.fillInWith('Yes')
        isAddressChangePage.form.saveAndContinueButton.click()

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockHomeOfficeOrderID,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
          order: {
            dataDictionaryVersion: 'DDV7',
            isSentencingAct: true,
            interestedParties: {
              notifyingOrganisation: 'HOME_OFFICE',
            },
          },
        })

        const taskListPage = Page.visit(OrderTasksPage, { orderId: mockHomeOfficeOrderID })

        taskListPage.riskInformationTask.shouldHaveStatus('Optional')
        taskListPage.additionalDocumentsTask.shouldHaveStatus('Optional')
      })

      it('risk information and additional documents sections are optional for courts', () => {
        const mockCourtOrderID = uuidv4()

        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
          stubCohort: false,
          userId: mockCourtOrderID,
        })

        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: 'user-cohort',
          response: { cohort: 'COURT', activeCaseload: 'Court Test' },
        })

        cy.task('stubCemoCreateOrder', {
          httpStatus: 200,
          id: mockCourtOrderID,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
        })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockCourtOrderID,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
          order: {
            dataDictionaryVersion: 'DDV7',
          },
        })

        cy.signIn()

        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [] })
        const page = Page.visit(SearchPage)

        page.searchBox.type('Unknown name')
        page.searchButton.click()

        page.variationFormButton
          .should('exist')
          .should('contain.text', 'Tell us about a change to a form sent by email')
        page.variationFormButton.click()
        Page.verifyOnPage(IsAddressChangePage)

        const isAddressChangePage = Page.visit(IsAddressChangePage)

        isAddressChangePage.form.fillInWith('Yes')
        isAddressChangePage.form.saveAndContinueButton.click()

        const notifyingOrganisationPage = Page.verifyOnPage(NotifyingOrganisationPage)

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockCourtOrderID,
          status: 'IN_PROGRESS',
          type: 'VARIATION',
          order: {
            dataDictionaryVersion: 'DDV7',
            isSentencingAct: true,
            interestedParties: {
              notifyingOrganisation: 'CIVIL_COUNTY_COURT',
              notifyingOrganisationName: 'BIRKENHEAD_COUNTY_AND_CIVIL_COURT',
              notifyingOrganisationEmail: 'court@test.com',
            },
          },
        })

        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockCourtOrderID,
          subPath: '/interested-parties',
          method: 'PUT',
          response: {
            notifyingOrganisation: 'CIVIL_COUNTY_COURT',
            notifyingOrganisationName: 'BIRKENHEAD_COUNTY_AND_CIVIL_COURT',
            notifyingOrganisationEmail: 'court@test.com',
          },
        })

        notifyingOrganisationPage.form.fillInWith({
          notifyingOrganisation: 'Civil and County Court',
          civilCountyCourt: 'BIRKENHEAD_COUNTY_AND_CIVIL_COURT',
          notifyingOrganisationEmailAddress: 'court@test.com',
        })

        notifyingOrganisationPage.form.organisationField.set('Civil and County Court')

        cy.get('#civilCountyCourt').type('Birkenhead County and Civil Court')
        cy.get('#civilCountyCourt')
          .parent()
          .find('[role="option"]')
          .contains('Birkenhead County and Civil Court')
          .click()

        notifyingOrganisationPage.form.continueButton.click()

        const taskListPage = Page.verifyOnPage(OrderTasksPage)

        taskListPage.riskInformationTask.shouldHaveStatus('Optional')
        taskListPage.additionalDocumentsTask.shouldHaveStatus('Optional')
      })
    })

    describe('when rendering an order', () => {
      const mockDate = new Date(2000, 10, 20).toISOString()
      const mockOrder = {
        ...basicOrder,
        status: 'SUBMITTED',
        deviceWearer: {
          ...basicOrder.deviceWearer,
          firstName: 'Bob',
          lastName: 'Builder',
          dateOfBirth: mockDate,
          pncId: 'some id',
          nomisId: 'some other id',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
        },
        monitoringConditions: {
          ...basicOrder.monitoringConditions,
          startDate: mockDate,
          endDate: mockDate,
        },
        fmsResultDate: mockDate,
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '',
            addressLine2: '',
            addressLine3: 'Glossop',
            addressLine4: '',
            postcode: '',
          },
        ],
      }

      let page: SearchPage
      beforeEach(() => {
        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [mockOrder] })
        page = Page.visit(SearchPage)
      })
      describe('when searching by name', () => {
        beforeEach(() => {
          page.searchBox.type('Bob Builder')
          page.searchButton.click()
        })

        it('should show correct headings', () => {
          page.ordersList.contains('Name')
          page.ordersList.contains('Status')
          page.ordersList.contains('Date of birth')
          page.ordersList.contains('Personal ID number')
          page.ordersList.contains('Start date')
          page.ordersList.contains('End date')
          page.ordersList.contains('Last updated')
        })

        it('should show correct order details', () => {
          page.ordersList.contains('Bob Builder')
          page.ordersList.contains('Submitted')
          page.ordersList.contains('some id')
          page.ordersList.contains('Glossop')
          page.ordersList.contains('20/11/2000')
          page.ordersList.find('tbody td').should('not.contain', 'Youth')
        })
      })

      it('should show correct order details for draft order', () => {
        const draftOrder = {
          ...basicOrder,
          status: 'IN_PROGRESS',
        }

        cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [draftOrder] })
        page = Page.visit(SearchPage)
        page.searchBox.type('Bob Builder')
        page.searchButton.click()
        page.ordersList.contains('Draft')
      })

      describe('when searching by personal ID number', () => {
        beforeEach(() => {
          page.searchBox.type('cepr')
          page.searchButton.click()
        })

        it('should show correct headings', () => {
          page.ordersList.contains('Name')
          page.ordersList.contains('Date of birth')
          page.ordersList.contains('Personal ID number')
          page.ordersList.contains('Start date')
          page.ordersList.contains('End date')
          page.ordersList.contains('Last updated')
        })

        it('should show correct order details', () => {
          page.ordersList.contains('Bob Builder')
          page.ordersList.contains('cepr')
          page.ordersList.contains('ccrn')
          page.ordersList.contains('Glossop')
          page.ordersList.contains('20/11/2000')
          page.ordersList.find('tbody td').should('not.contain', 'Youth')
        })
      })

      describe('when showing search results for different organisations', () => {
        const youthMockOrder = {
          ...mockOrder,
          deviceWearer: {
            ...mockOrder.deviceWearer,
            firstName: 'Bianca',
            dateOfBirth: new Date(2016, 10, 20).toISOString(),
            adultAtTimeOfInstallation: false,
          },
          deviceWearerResponsibleAdult: {
            relationship: 'other',
            otherRelationshipDetails: 'Parent',
            fullName: 'Audrey Builder',
            contactNumber: '07101 123 456',
          },
        }

        it('should show youth status and caseload info', () => {
          cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [youthMockOrder] })
          page = Page.visit(SearchPage)

          page.searchBox.type('Bianca Builder')
          page.searchButton.click()

          cy.contains('Showing: HMP ABC').should('be.visible')
          cy.contains('a', 'Change location').should(
            'have.attr',
            'href',
            'https://digital.prison.service.justice.gov.uk/change-caseload',
          )

          page.ordersList.contains('Youth')
          page.ordersList.find('tbody td').should('contain', 'Youth')
        })

        it('should not show youth status and caseload info if probation', () => {
          cy.task('reset')
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
            response: { cohort: 'PROBATION', activeCaseload: 'Probation Test' },
          })

          cy.signIn()

          cy.task('stubCemoSearchOrders', { httpStatus: 200, orders: [youthMockOrder] })
          page = Page.visit(SearchPage)

          page.searchBox.type('Bob Builder')
          page.searchButton.click()

          cy.get('body').should('not.contain', 'Youth')
          cy.get('body').should('not.contain', 'Showing:')
          cy.get('body').find('a').should('not.contain', 'Change location')
        })
      })
    })

    context('Submitting a create order request', () => {
      it('should create a new order', () => {
        // Visit the search page
        const page = Page.visit(SearchPage)

        // Create a new order
        page.newOrderFormButton.click()

        // Verify the user was redirected to the your details page
        Page.verifyOnPage(NotifyingOrganisationPage)
      })
    })
  })
})
