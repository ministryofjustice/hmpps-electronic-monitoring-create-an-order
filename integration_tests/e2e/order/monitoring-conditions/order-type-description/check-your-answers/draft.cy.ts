import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'

const mockOrderId = uuidv4()

context('', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'PROBATION',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'HOME_OFFICE',
            responsibleOrganisationRegion: '',
            responsibleOrganisationEmail: '',
          },
        },
      })
      cy.signIn()

      // go through the flow
      const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
      orderTypePage.form.orderTypeField.set('Community')
      orderTypePage.form.continueButton.click()
    })

    const pageHeading = 'Check your answers'

    it('Page accessisble', () => {
      const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.checkIsAccessible()
    })

    it('Should display content', () => {
      const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.orderInformationSection.shouldExist()
    })
  })
})
