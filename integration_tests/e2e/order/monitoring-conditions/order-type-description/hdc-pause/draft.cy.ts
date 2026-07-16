import { v4 as uuidv4 } from 'uuid'
import HdcPausePage from './hdcPausePage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()
context('orderType', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Page accessisble', () => {
    const page = Page.visit(HdcPausePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(HdcPausePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')
    cy.get('p')
      .contains('Device wearers must not be released or re-released on HDC on or after 2 September 2026.')
      .should('exist')
    cy.get('p').contains('A device wearer may be re-released only if all of the following apply:').should('exist')
    cy.get('ul').children().get('li').contains('They were on HDC in the community.').should('exist')
    cy.get('ul')
      .children()
      .get('li')
      .contains('They were recalled during their HDC period on or after 2 September 2026.')
      .should('exist')
    cy.get('ul')
      .children()
      .get('li')
      .contains('The recall was under Section 255(1)(b) (inability to monitor).')
      .should('exist')
    cy.get('ul').children().get('li').contains('They are being re-released.').should('exist')
    cy.get('ul')
      .children()
      .get('li')
      .contains('They meet HDC policy, eligibility criteria, and pass the risk assessment.')
      .should('exist')
    cy.get('p').contains('If you are unsure about eligibility, check with the COM.').should('exist')
    page.form.hdcPauseField.shouldExist()
    page.form.hdcPauseField.shouldNotBeDisabled()

    page.form.continueButton.should('exist')
  })
})
