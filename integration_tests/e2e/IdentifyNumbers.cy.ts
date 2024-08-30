import HDCPage from '../pages/hdc'
import NewFormPage from '../pages/newForm'
import Page from '../pages/page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Should go to Identifify numbers section page', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    const hdcPage = Page.verifyOnPage(HDCPage)
    hdcPage.startButton().click()
    cy.get('a:contains("Identify numbers")').click()
    cy.get('h1').contains('Identify numbers questions').should('exist')
    cy.get('.govuk-task-list').should('exist')
    cy.get('.govuk-task-list__name-and-hint').contains('NOMIS ID').should('exist')
    cy.get('.govuk-task-list__name-and-hint').contains('PNC ID').should('exist')
    cy.get('a:contains("Change")').should('have.length', 2)
  })

  it('Should go to Nomis ID question Page', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    const hdcPage = Page.verifyOnPage(HDCPage)
    hdcPage.startButton().click()
    cy.get('a:contains("Identify numbers")').click()
    cy.get('.govuk-task-list').should('exist')
    cy.get('[href="/section/identifyNumbers/question/nomisId"]').click()
    cy.get('h1').contains('Identify Numbers').should('exist')
    cy.get('label').contains('National offender management information system (NOMIS ID)').should('exist')
    cy.get('#intput-nomisId').should('exist')
    cy.get('button:contains("Next")').should('exist')
  })

  // TODO test user input validation and next button
})
