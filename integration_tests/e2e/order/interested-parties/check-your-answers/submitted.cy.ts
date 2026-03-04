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
  context('with full information in the past', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          dataDictionaryVersion: 'DDV6',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: 'officer',
            responsibleOfficerLastName: 'name',
            responsibleOfficerEmail: 'officer@email',

            responsibleOrganisation: 'PROBATION',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'WALES',
          },
          probationDeliveryUnit: {
            unit: 'COUNTY_DURHAM_AND_DARLINGTON',
          },
          monitoringConditions: {
            startDate: new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
            endDate: '2030-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: true,
            mandatoryAttendance: false,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: '',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
            pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
            offenceType: '',
          },
        },
      })
    })

    it('shows notification answers for checking if start date of order in past', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Prison service' },
        { key: 'Select the name of the Prison', value: 'Altcourse Prison' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
      ])

      page.organisationDetailsSection.shouldNotHaveItems([
        "What is the Responsible Officer's first name?",
        "What is the Responsible Officer's last name?",
        "What is the Responsible Officer's email address?",
        "What is the Responsible Officer's organisation?",
        'Select the Probation region',
        "What is the Responsible Organisation's email address? (optional)",
      ])

      page.probationDeliveryUnitSection.shouldNotExist()

      page.changeLinks.should('not.exist')

      cy.contains('How do I change the Responsible Officer or Responsible Organisation?').click()

      cy.get('.govuk-details__text').contains('Use the service request portal if you have access.')

      cy.get('.govuk-details__text').contains("If you don't have access:")
      cy.get('.govuk-details__text').contains("complete the 'Responsible Officer Notification to EMS' form")
      cy.get('.govuk-details__text').contains('email it to EMSEnforcement@ems.co.uk')

      cy.contains('EMSEnforcement@ems.co.uk').and('have.attr', 'href', 'mailto:EMSEnforcement@ems.co.uk')
    })
  })

  context('with full information in the future', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          dataDictionaryVersion: 'DDV6',
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: 'officer',
            responsibleOfficerLastName: 'name',
            responsibleOfficerEmail: 'officer@email',

            responsibleOrganisation: 'PROBATION',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'WALES',
          },
          probationDeliveryUnit: {
            unit: 'COUNTY_DURHAM_AND_DARLINGTON',
          },
          monitoringConditions: {
            startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
            endDate: '2030-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: false,
            exclusionZone: false,
            trail: true,
            mandatoryAttendance: false,
            alcohol: false,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: '',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
            pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
            offenceType: '',
          },
        },
      })
    })

    it('shows all interested parties answers and pdu for checking if start date of order in future', () => {
      const page = Page.visit(InterestedPartiesCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Prison service' },
        { key: 'Select the name of the Prison', value: 'Altcourse Prison' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's first name?", value: 'officer' },
        { key: "What is the Responsible Officer's last name?", value: 'name' },
        { key: "What is the Responsible Officer's email address?", value: 'officer@email' },
        { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
        { key: 'Select the Probation region', value: 'Wales' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])

      page.probationDeliveryUnitSection.shouldHaveItems([
        {
          key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)",
          value: 'County Durham and Darlington',
        },
      ])

      page.changeLinks.should('not.exist')
      cy.get('.govuk-details__text').should('not.exist')
    })
  })
})
