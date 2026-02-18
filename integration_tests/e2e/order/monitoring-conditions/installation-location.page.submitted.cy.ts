import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()
context('Monitoring conditions', () => {
  context('Installation location', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            monitoringConditions: {
              startDate: '2024-06-01T00:00:00Z',
              endDate: '2025-02-01T00:00:00Z',
              orderType: 'CIVIL',
              curfew: true,
              exclusionZone: true,
              trail: true,
              mandatoryAttendance: true,
              alcohol: true,
              conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
              orderTypeDescription: null,
              sentenceType: 'IPP',
              issp: 'YES',
              hdc: 'NO',
              prarr: 'UNKNOWN',
              pilot: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
              offenceType: '',
            },
            installationLocation: { location: 'PRISON' },
          },
        })

        cy.signIn()
      })

      it('Should display content in read only mode', () => {
        const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.locationField.shouldHaveValue('At a prison')
        page.form.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
