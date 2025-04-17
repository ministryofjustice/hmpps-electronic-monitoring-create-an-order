import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import IntallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'

const mockOrderId = uuidv4()

context('installation and risk - check your answers', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Notifying organisations details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          deviceWearer: {
            nomisId: 'nomis',
            pncId: 'pnc',
            deliusId: 'delius',
            prisonNumber: 'prison',
            homeOfficeReferenceNumber: 'ho',
            firstName: 'test',
            lastName: 'tester',
            alias: 'tes',
            dateOfBirth: '2000-01-01T00:00:00Z',
            adultAtTimeOfInstallation: true,
            sex: 'MALE',
            gender: 'male',
            disabilities: 'MENTAL_HEALTH',
            otherDisability: null,
            noFixedAbode: null,
            interpreterRequired: false,
          },
          DeviceWearerResponsibleAdult: null,
        },
      })

      cy.signIn()
    })

    it('shows notify organisations details section', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.notifyOrganisationsDetailsSection.shouldExist()
      page.notifyOrganisationsDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'test' },
        { key: 'Name of the prison', value: 'tester' },
        { key: "What is your team's contact email address?", value: 'tes' },
      ])
    })

    it('shows responsible officers details section', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.responsibleOfficersDetailsSection.shouldExist()
      page.responsibleOfficersDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Officer's first name?", value: 'test' },
        { key: "What is the Responsible Officer's last name?", value: 'tester' },
        { key: "What is the Responsible Officer's telephone number?", value: 'tes' },
        { key: "What is the Responsible Officers's team contact email address? (optional)", value: 'tes' },
      ])
    })

    it('Responsible Organisations details', () => {
      const page = Page.visit(IntallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId })

      page.responsibleOrganisationsDetails.shouldExist()
      page.responsibleOrganisationsDetails.shouldHaveItems([
        { key: "What is the Responsible Officer's organisation?", value: 'test' },
      ])
    })
  })
})
