import { v4 as uuidv4 } from 'uuid'
import OrderTypePage from './OrderTypePage'
import Page from '../../../../../pages/page'

const stubGetOrder = (notifyingOrg: string = 'PROBATION') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
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
}

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Rejection', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubGetOrder()

      cy.signIn()
    })

    it('Page accessisble', () => {
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })

    it('Should display content', () => {
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.orderTypeField.shouldExist()
      page.form.orderTypeField.shouldNotBeDisabled()

      page.form.continueButton.should('exist')
    })

    it('when notifying org is probation', () => {
      stubGetOrder('PROBATION')
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })

      page.form.orderTypeField.shouldHaveOption('Release from prison')
      page.form.orderTypeField.shouldHaveOption('Community')
    })

    it('when notifying org is a court', () => {
      stubGetOrder('CROWN_COURT')
      const page = Page.visit(OrderTypePage, { orderId: mockOrderId })

      page.form.orderTypeField.shouldHaveOption('Community')
      page.form.orderTypeField.shouldHaveOption('Bail')
      page.form.orderTypeField.shouldHaveOption('Civil')
    })
  })
})
