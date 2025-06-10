import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()

const stubGetOrder = (noFixedAbode: boolean, addresses) => {
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
        gender: 'MALE',
        disabilities: 'MENTAL_HEALTH',
        otherDisability: null,
        noFixedAbode: true,
        interpreterRequired: noFixedAbode,
      },
    },
    addresses,
  })
}

context('Monitoring conditions', () => {
  context('Installation location', () => {
    context('Viewing a draft order with no installation location', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder(false, [
          {
            addressType: 'PRIMARY',
            addressLine1: '10 Downing Street',
            addressLine2: 'London',
            addressLine3: 'SW1A 2AB',
            addressLine4: '',
            postcode: '',
          },
        ])
        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAndReturnButton.should('exist')

        page.errorSummary.shouldNotExist()
        page.backToSummaryButton.should('not.exist')
        page.checkIsAccessible()
      })

      it('Should grey out fixed address option, when device wearer has no fixed address', () => {
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        stubGetOrder(true, [])
        const page = Page.visit(InstallationLocationPage, {
          orderId: mockOrderId,
        })
        page.form.locationField.shouldHaveDisabledOption('Device wearer has no fixed address')
      })
    })
  })
})
