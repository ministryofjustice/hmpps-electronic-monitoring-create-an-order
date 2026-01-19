import { v4 as uuidv4 } from 'uuid'

const mockOrderId = uuidv4()
const stubOrder = (notifyingOrganisation = 'CROWN_COURT') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order: {
      interestedParties: {
        notifyingOrganisation,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
        responsibleOrganisationAddress: {
          addressType: 'RESPONSIBLE_ORGANISATION',
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          postcode: '',
        },
        responsibleOrganisationEmail: '',
        responsibleOrganisationPhoneNumber: '',
        responsibleOrganisationRegion: '',
      },
    },
  })
}
context('Draft Offences', () => {
  context('Notifying organisation is court', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder()
      cy.signIn()
    })
  })
})
