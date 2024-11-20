import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import CheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'

const mockOrderId = uuidv4()
const pagePath = '/about-the-device-wearer/check-your-answers'

context('Device wearer - check your answers', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Device Wearer is 18 or over', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          deviceWearer: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: 'test',
            lastName: 'tester',
            alias: null,
            dateOfBirth: null,
            adultAtTimeOfInstallation: true,
            sex: null,
            gender: 'self-identify',
            otherGender: 'Furby',
            disabilities: 'Other',
            otherDisability: 'Broken arm',
            noFixedAbode: null,
            interpreterRequired: null,
          },
          DeviceWearerResponsibleAdult: null,
        },
      })

      cy.signIn()
    })

    it('should not show responsible adult section', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })

      page.responsibleAdultSection().should('not.exist')
    })
  })

  context('Device Wearer is under 18', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          deviceWearer: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: 'test',
            lastName: 'tester',
            alias: null,
            dateOfBirth: null,
            adultAtTimeOfInstallation: false,
            sex: null,
            gender: 'self-identify',
            otherGender: 'Furby',
            disabilities: 'Other',
            otherDisability: 'Broken arm',
            noFixedAbode: null,
            interpreterRequired: null,
          },
          deviceWearerResponsibleAdult: {
            relationship: 'Other',
            otherRelationshipDetails: 'Partner',
            fullName: 'Audrey Taylor',
            contactNumber: '07101 123 456',
          },
        },
      })

      cy.signIn()
    })

    it('should not show responsible adult section', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId })

      page.responsibleAdultSection().should('exist')
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
