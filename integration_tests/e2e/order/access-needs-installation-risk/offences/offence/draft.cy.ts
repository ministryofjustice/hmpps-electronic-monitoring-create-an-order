import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffencePage from './offencePage'
import { Offence } from '../../../../../../server/models/Offence'
import OffenceExistingItemPage from './offenceExistingItemPage'

const mockOrderId = uuidv4()
const stubOrder = (notifyingOrganisation = 'CROWN_COURT', offences: Offence[] = []) => {
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
      offences,
    },
  })
}
context('Draft Offences', () => {
  context('Notifying organisation is court', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.signIn()
    })

    it('Should display all offence options and show date question', () => {
      stubOrder()
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.form.shouldNotBeDisabled()
      page.errorSummary.shouldNotExist()
      page.backButton.should('exist')
      page.checkIsAccessible()
      page.form.offenceTypeField.shouldExist()
      cy.get('#offenceDate').should('exist')
      page.form.shouldHaveAllOptions()
      page.form.offenceTypeField.shouldNotHaveOption('They have not committed an offence')
    })

    it('Should load offence type and offence date from existing offence', () => {
      const mockOffenceId = uuidv4()
      stubOrder('CROWN_COURT', [
        {
          id: mockOffenceId,
          offenceType: 'SEXUAL_OFFENCES',
          offenceDate: '2020-01-01T00:00:00Z',
        },
      ])
      const page = Page.visit(OffenceExistingItemPage, { orderId: mockOrderId, offenceId: mockOffenceId })
      page.form.offenceTypeField.shouldHaveValue('Sexual offences')
      page.form.offenceDateField.shouldHaveValue(new Date(2020, 0, 1))
    })
  })

  context('Notifying organisation is prison', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder('PRISON')
      cy.signIn()
    })

    it('Should display all offence options and not show date question', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.form.shouldNotBeDisabled()
      page.errorSummary.shouldNotExist()
      page.backButton.should('exist')
      page.checkIsAccessible()
      page.form.offenceTypeField.shouldExist()
      cy.get('#offenceDate').should('not.exist')
      page.form.shouldHaveAllOptions()
      page.form.offenceTypeField.shouldNotHaveOption('They have not committed an offence')
    })

    it('Should load offence type and offence date from existing offence', () => {
      const mockOffenceId = uuidv4()
      stubOrder('PRISON', [
        {
          id: mockOffenceId,
          offenceType: 'SEXUAL_OFFENCES',
        },
      ])
      const page = Page.visit(OffenceExistingItemPage, { orderId: mockOrderId, offenceId: mockOffenceId })
      page.form.offenceTypeField.shouldHaveValue('Sexual offences')
    })
  })

  context('Notifying organisation is home office', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      stubOrder('HOME_OFFICE')
      cy.signIn()
    })

    it('Should display all offence options and the No Offence option, and not show date question', () => {
      const page = Page.visit(OffencePage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.form.shouldNotBeDisabled()
      page.errorSummary.shouldNotExist()
      page.backButton.should('exist')
      page.checkIsAccessible()
      page.form.offenceTypeField.shouldExist()
      cy.get('#offenceDate').should('not.exist')
      page.form.shouldHaveAllOptions()
      page.form.offenceTypeField.shouldHaveOption('They have not committed an offence')
    })
  })
})
