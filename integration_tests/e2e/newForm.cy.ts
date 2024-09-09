import NewFormPage from '../pages/newForm'
import Page from '../pages/page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Select form options should exist', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    newformPage.selectFromLabel().should('exist')
    newformPage.formOptionRadios().should('exist')
    newformPage.radioItem().should('have.length', 7)
    newformPage.nextButton().should('exist')
  })

  it('All form options should exist', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    newformPage
      .radioItem()
      .children('.govuk-radios__label')
      .contains('Annex D - Notification of Release Template')
      .should('exist')
    newformPage
      .radioItem()
      .children('.govuk-radios__label')
      .contains('Create EM Order form descriptions')
      .should('exist')
    newformPage
      .radioItem()
      .children('.govuk-radios__label')
      .contains('EM Licence Conditions Notification Form')
      .should('exist')
    newformPage
      .radioItem()
      .children('.govuk-radios__label')
      .contains('EM Licence Variation Notification Form')
      .should('exist')
    newformPage.radioItem().children('.govuk-radios__label').contains('HDC Agency Notification Form').should('exist')
    newformPage.radioItem().children('.govuk-radios__label').contains('Master HMCTS EMS Form April').should('exist')
    newformPage.radioItem().children('.govuk-radios__label').contains('PSCS Address Variation Form').should('exist')
  })

  it('Should redirect to start new form page', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').should('exist')
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    cy.url().should('to.match', /newForm$/)

    cy.get('h1').contains('Home Detention Curfew (HDC) form').should('exist')
  })
})
