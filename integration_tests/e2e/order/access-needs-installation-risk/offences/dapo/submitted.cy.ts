import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import DapoPage from './DapoPage'

const mockOrderId = uuidv4()
const clauseId = uuidv4()
const mockDate = new Date(2025, 1, 1)

context('dapo page', () => {
  context('Viewing a submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          dapoClauses: [
            {
              clause: 'some clause',
              date: mockDate.toISOString(),
              id: clauseId,
            },
          ],
        },
      })

      cy.signIn()
    })

    it('can view a specific clause', () => {
      const page = Page.visit(DapoPage, { orderId: mockOrderId, clauseId }, {}, true)

      page.submittedBanner.should('contain', 'You are viewing a submitted order.')

      page.form.clauseNumberField.shouldHaveValue('some clause')
      page.form.clauseNumberField.shouldBeDisabled()
      page.form.dateField.shouldHaveValue(mockDate)
      page.form.dateField.shouldBeDisabled()

      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')

      page.errorSummary.shouldNotExist()
    })
  })
})
