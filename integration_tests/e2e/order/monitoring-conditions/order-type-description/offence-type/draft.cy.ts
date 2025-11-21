import { v4 as uuidv4 } from 'uuid'
import OffenceTypePage from './OffenceTypePage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()

context('offence type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('Page accessible', () => {
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.offenceTypeField.shouldExist()

    page.form.continueButton.should('exist')
  })

  it('correct contents', () => {
    const page = Page.visit(OffenceTypePage, { orderId: mockOrderId })

    page.form.offenceTypeField.shouldHaveOption('Burglary in a Dwelling - Indictable only')
    page.form.offenceTypeField.shouldHaveOption('Burglary in a Dwelling - Triable either way')
    page.form.offenceTypeField.shouldHaveOption('Aggravated Burglary in a Dwelling')
    page.form.offenceTypeField.shouldHaveOption('Burglary in a Building other than a Dwelling - Indictable only')
    page.form.offenceTypeField.shouldHaveOption('Burglary in a Building other than a Dwelling - Triable either way')
    page.form.offenceTypeField.shouldHaveOption('Aggravated Burglary in a Building not a Dwelling')
    page.form.offenceTypeField.shouldHaveOption('Theft from the Person of Another')
    page.form.offenceTypeField.shouldHaveOption('Theft from a Vehicle')
    page.form.offenceTypeField.shouldHaveOption(
      'Theft from a Motor Vehicle (excl. aggravated vehicle taking) - Triable either way (MOT)',
    )
    page.form.offenceTypeField.shouldHaveOption('Robbery')
    page.form.offenceTypeField.shouldHaveOption('They did not commit one of these offences')

    const hintText = 'The acquisitive crime offence needs to be their longest or equal longest sentence.'
    const redundantCOMText = 'Any queries around pilot eligibility need to be raised with the appropriate COM.'
    page.form.offenceTypeField.element.contains(hintText)
    page.form.offenceTypeField.element.contains(redundantCOMText).should('not.exist')
  })
})
