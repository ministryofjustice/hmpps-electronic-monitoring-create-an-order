import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import InterestedPartiesCheckYourAnswersPage from './interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('interested parties check answers page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.signIn()
  })
  context('with full information', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerName: 'officer name',
            responsibleOfficerPhoneNumber: '01234567891',

            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
          },
        },
      })
    })
    it('shows answers for checking', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId })

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Prison Service' },
        { key: 'Select the name of the Prison', value: 'Altcourse Prison' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'officer name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: 'Select the Police force area', value: 'Cheshire' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])

      page.changeLinks.should('exist')
      page.continueButton().should('exist')
      page.continueButton().contains('Save and go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Save as draft')
    })
  })
  context('without responsible organisation', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerName: 'officer name',
            responsibleOfficerPhoneNumber: '01234567891',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: null,
            responsibleOrganisationRegion: null,
          },
        },
      })
    })
    it('shows answers for without responsible organisation', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId })

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldNotHaveItems([
        "What is the Responsible Officer's organisation?",
        'Select the Police force area',
        "What is the Responsible Organisation's email address? (optional)",
      ])

      page.changeLinks.should('exist')
      page.continueButton().should('exist')
      page.continueButton().contains('Save and go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Save as draft')
    })
  })

  context('without responsible officer', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV5',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerName: null,
            responsibleOfficerPhoneNumber: null,

            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
          },
        },
      })
    })
    it('shows answers for without responsible organisation', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId })

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldNotHaveItems([
        "What is the Responsible Officer's full name?",
        "What is the Responsible Officer's telephone number?",
      ])

      page.changeLinks.should('exist')
      page.continueButton().should('exist')
      page.continueButton().contains('Save and go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Save as draft')
    })
  })
})
