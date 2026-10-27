import { v4 as uuidv4 } from 'uuid'

const mockOrderId = uuidv4()

context('About the device wearer', () => {
  context('Adult at installation (WIP skeleton)', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should render the WIP page', () => {
      cy.visit(`/order/${mockOrderId}/about-the-device-wearer/adult-at-installation`)
      cy.contains('WIP Responsible adult')
    })
  })
})
