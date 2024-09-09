import HDCPage from '../pages/hdc'
import NewFormPage from '../pages/newForm'
import Page from '../pages/page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Should load HDC form start page', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').should('exist')
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    const hdcPage = Page.verifyOnPage(HDCPage)
    hdcPage.startButton().should('exist')
    cy.get('h1').contains('Home Detention Curfew (HDC) form').should('exist')
    cy.get('p')
      .contains(
        'Home Detention Curfew (HDC) is a scheme which allows some people to be released from custody if they have a suitable address to go to. The person will wear a device which will monitor if they follow the rules set out in their curfew.',
      )
      .should('exist')
  })

  it('Should go to form details after start', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    const hdcPage = Page.verifyOnPage(HDCPage)
    hdcPage.startButton().click()
    cy.get('h1').contains('Home Detention Curfew (HDC) form').should('exist')
    cy.get('.govuk-task-list').should('exist')
    cy.get('a:contains("Identity numbers")').should('exist')
    cy.get('a:contains("About the device wearer")').should('exist')
    cy.get('a:contains("About the HDC")').should('exist')
    cy.get('a:contains("Other monitoring conditions")').should('exist')
    cy.get('a:contains("Installations and risk information")').should('exist')
    cy.get('a:contains("About organisations")').should('exist')
  })

  // TODO test each section links
  it('Should go to identity numbers section page', () => {
    cy.signIn()
    cy.visit('/newForm')
    const newformPage = Page.verifyOnPage(NewFormPage)
    cy.get('[value=HDC]').check()
    newformPage.nextButton().click()
    const hdcPage = Page.verifyOnPage(HDCPage)
    hdcPage.startButton().click()
    cy.get('h1').contains('Home Detention Curfew (HDC) form').should('exist')
    cy.get('.govuk-task-list').should('exist')
    cy.get('a:contains("Identity numbers")').click()
    cy.get('h1').contains('Identity numbers questions').should('exist')
  })
})
