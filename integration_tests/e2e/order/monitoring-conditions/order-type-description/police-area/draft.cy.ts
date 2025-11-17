import { v4 as uuidv4 } from 'uuid'
import PoliceAreaPage from './PoliceAreaPage'
import Page from '../../../../../pages/page'

const mockOrderId = uuidv4()

context('police area', () => {
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
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.policeAreaField.shouldExist()

    page.form.continueButton.should('exist')
  })

  it('correct contents', () => {
    const page = Page.visit(PoliceAreaPage, { orderId: mockOrderId })

    const hintText =
      'Enter the full postcode of the device wearer release address in the police force lookup (opens in a new tab) to find the area.'
    const redundantCOMText = 'Any queries around pilot eligibility need to be raised with the appropriate COM.'

    page.form.policeAreaField.element.contains(hintText)
    page.form.policeAreaField.element.contains('a', 'police force lookup (opens in a new tab)')
    page.form.policeAreaField.element.contains(redundantCOMText).should('not.exist')

    page.form.policeAreaField.shouldHaveOption('Avon and Somerset')
    page.form.policeAreaField.shouldHaveOption('Bedfordshire')
    page.form.policeAreaField.shouldHaveOption('Cheshire')
    page.form.policeAreaField.shouldHaveOption('City of London')
    page.form.policeAreaField.shouldHaveOption('Cumbria')
    page.form.policeAreaField.shouldHaveOption('Derbyshire')
    page.form.policeAreaField.shouldHaveOption('Durham')
    page.form.policeAreaField.shouldHaveOption('Essex')
    page.form.policeAreaField.shouldHaveOption('Gloucestershire')
    page.form.policeAreaField.shouldHaveOption('Gwent')
    page.form.policeAreaField.shouldHaveOption('Hampshire')
    page.form.policeAreaField.shouldHaveOption('Hertfordshire')
    page.form.policeAreaField.shouldHaveOption('Humberside')
    page.form.policeAreaField.shouldHaveOption('Kent')
    page.form.policeAreaField.shouldHaveOption('Metropolitan Police')
    page.form.policeAreaField.shouldHaveOption('North Wales')
    page.form.policeAreaField.shouldHaveOption('Nottinghamshire')
    page.form.policeAreaField.shouldHaveOption('Sussex')
    page.form.policeAreaField.shouldHaveOption('West Midlands')
    page.form.policeAreaField.shouldHaveOption(
      "The device wearer's release address is in a different police force area",
    )
  })
})
