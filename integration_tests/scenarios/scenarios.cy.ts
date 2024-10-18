import CEMO001 from './SR01 Adult Device Wearer/CEMO001'

context('Scenarios', () => {
  before(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })
  })

  context('SRO1 Adult Device Wearer', () => {
    context('CEMO001', CEMO001)
  })
})
