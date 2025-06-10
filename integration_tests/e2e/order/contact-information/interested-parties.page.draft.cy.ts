import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Interested parties', () => {
    context('Viewing a draft order', () => {
      context('DDv4', () => {
        const testFlags = { DD_V5_1_ENABLED: false }

        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
          cy.task('reset')
          cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
          cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
          cy.signIn()
        })

        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should display DDv4 content', () => {
          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })
          page.header.userName().should('contain.text', 'J. Smith')
          page.header.phaseBanner().should('contain.text', 'dev')

          page.form.saveAndContinueButton.should('exist')
          page.form.saveAndReturnButton.should('exist')
          page.form.shouldNotBeDisabled()
          page.errorSummary.shouldNotExist()
          page.backButton.should('exist')
          page.form.shouldHaveAllOptions()

          page.form.crownCourtField.shouldNotHaveOption('Barbican (Aldersgate House) Crown Court')
          page.form.crownCourtField.shouldNotHaveOption('Mold Crown Court')
          page.form.crownCourtField.shouldNotHaveOption('Truro Crown Court')

          page.form.magistratesCourtField.shouldNotHaveOption('Camberwell Green Magistrates Court')
          page.form.magistratesCourtField.shouldNotHaveOption('Maidenhead Magistrates Court')
          page.form.magistratesCourtField.shouldNotHaveOption('Sittingbourne Magistrates Court')

          page.form.prisonField.shouldNotHaveOption('Millsike Prison')

          page.checkIsAccessible()
        })
      })

      context('DDv5', () => {
        const testFlags = { DD_V5_1_ENABLED: true }

        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
          cy.task('reset')
          cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
          cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
          cy.signIn()
        })

        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('Should display DDV5 content', () => {
          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })
          page.header.userName().should('contain.text', 'J. Smith')
          page.header.phaseBanner().should('contain.text', 'dev')

          page.form.saveAndContinueButton.should('exist')
          page.form.saveAndReturnButton.should('exist')
          page.form.shouldNotBeDisabled()
          page.errorSummary.shouldNotExist()
          page.backButton.should('exist')

          page.form.shouldHaveAllDDV5Options()

          page.form.civilCountyCourtField.shouldHaveOption('Aberystwyth County and Civil Court')
          page.form.civilCountyCourtField.shouldHaveOption('Gloucester County and Civil Court')
          page.form.civilCountyCourtField.shouldHaveOption('Weston Super Mare County and Civil Court')

          page.form.crownCourtField.shouldHaveOption('Barbican (Aldersgate House) Crown Court')
          page.form.crownCourtField.shouldHaveOption('Mold Crown Court')
          page.form.crownCourtField.shouldHaveOption('Truro Crown Court')

          page.form.familyCourtField.shouldHaveOption('Barnstable Family Court')
          page.form.familyCourtField.shouldHaveOption('Pontypridd Family Court')
          page.form.familyCourtField.shouldHaveOption('Wolverhampton Family Court')

          page.form.magistratesCourtField.shouldHaveOption('Camberwell Green Magistrates Court')
          page.form.magistratesCourtField.shouldHaveOption('Maidenhead Magistrates Court')
          page.form.magistratesCourtField.shouldHaveOption('Sittingbourne Magistrates Court')

          page.form.prisonField.shouldHaveOption('Millsike Prison')

          page.checkIsAccessible()
        })
      })
    })
  })
})
