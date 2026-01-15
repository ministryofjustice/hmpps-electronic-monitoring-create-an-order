import { v4 as uuidv4 } from 'uuid'
import PilotPage from './PilotPage'
import Page from '../../../../../pages/page'
import HdcPage from '../hdc/hdcPage'

const mockOrderId = uuidv4()
const mockDefaultOrder = {
  deviceWearer: {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: 'delius',
    prisonNumber: 'prison',
    homeOfficeReferenceNumber: '',
    complianceAndEnforcementPersonReference: 'cepr',
    courtCaseReferenceNumber: 'ccrn',
    firstName: 'test',
    lastName: 'tester',
    alias: 'tes',
    dateOfBirth: '2000-01-01T00:00:00Z',
    adultAtTimeOfInstallation: true,
    sex: 'MALE',
    gender: 'MALE',
    disabilities: 'MENTAL_HEALTH',
    otherDisability: null,
    noFixedAbode: false,
    interpreterRequired: false,
  },
  monitoringConditions: {
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-02-01T00:00:00Z',
    orderType: 'CIVIL',
    curfew: true,
    exclusionZone: true,
    trail: true,
    mandatoryAttendance: true,
    alcohol: true,
    conditionType: 'BAIL_ORDER',
    orderTypeDescription: 'DAPO',
    sentenceType: 'IPP',
    issp: 'YES',
    hdc: 'NO',
    prarr: 'UNKNOWN',
    pilot: null,
    offenceType: '',
  },
}

const stubGetOrder = order => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status: 'IN_PROGRESS',
    order,
  })
}

context('pilot', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder({ ...mockDefaultOrder })

    cy.signIn()

    const testFlags = {
      DAPOL_PILOT_PROBATION_REGIONS: 'KENT_SURREY_SUSSEX,WALES',
      LICENCE_VARIATION_PROBATION_REGIONS: 'YORKSHIRE_AND_THE_HUMBER,EAST_MIDLANDS',
    }

    cy.task('setFeatureFlags', testFlags)
  })

  it('Page accessible', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.pilotField.shouldExist()

    page.form.continueButton.should('exist')
  })

  it('Should disable DAPOL option and display message stating why if probation region not in pilot', () => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    mockDefaultOrder.monitoringConditions.hdc = 'YES'
    stubGetOrder({
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: 'YOUTH_COURT',
        notifyingOrganisationName: 'PENZANCE_YOUTH_COURT',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: 'YORKSHIRE_AND_THE_HUMBER',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '01234567891',
      },
    })

    Page.visit(PilotPage, { orderId: mockOrderId })

    cy.get('input[type="radio"][value="DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC"]').should(
      'be.disabled',
    )

    cy.get('.govuk-inset-text').contains(
      'The device wearer is being managed by the Yorkshire and the Humber probation region. To be eligible for the DAPOL pilot they must be managed by an in-scope region. Any queries around pilot eligibility need to be raised with the appropriate COM.',
    )
  })

  it('Should enable DAPOL option if probation region in pilot', () => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    mockDefaultOrder.monitoringConditions.hdc = 'YES'
    stubGetOrder({
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: 'YOUTH_COURT',
        notifyingOrganisationName: 'PENZANCE_YOUTH_COURT',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: 'KENT_SURREY_SUSSEX',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '01234567891',
      },
    })

    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.pilotField.shouldNotBeDisabled()

    cy.get('input[type="radio"][value="DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC"]').should(
      'be.enabled',
    )
  })

  it('Should not show licence variation project option to non-probation user', () => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    mockDefaultOrder.monitoringConditions.hdc = 'YES'
    stubGetOrder({
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: 'HOME_OFFICE',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'POLICE',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: '',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '01234567891',
      },
    })

    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.pilotField.shouldNotHaveOption('Licence Variation Project')
  })

  it('Should disable licence variation option and display message stating why if probation region not in pilot', () => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    mockDefaultOrder.monitoringConditions.hdc = 'YES'
    stubGetOrder({
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: 'PROBATION',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: 'LONDON',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '01234567891',
      },
    })

    Page.visit(PilotPage, { orderId: mockOrderId })

    cy.get('input[type="radio"][value="LICENCE_VARIATION_PROJECT"]').should('be.disabled')

    cy.get('.govuk-inset-text').contains(
      'The device wearer is being managed by the London probation region. To be eligible for the Licence Variation pilot they must be managed by an in-scope region.',
    )
  })

  it('Should enable licence variation project option if probation user and region in pilot', () => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    mockDefaultOrder.monitoringConditions.hdc = 'YES'
    stubGetOrder({
      ...mockDefaultOrder,
      interestedParties: {
        notifyingOrganisation: 'PROBATION',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: 'responsible@organisation',
        responsibleOrganisationRegion: 'YORKSHIRE_AND_THE_HUMBER',
        responsibleOfficerName: 'name',
        responsibleOfficerPhoneNumber: '01234567891',
      },
    })

    const page = Page.visit(PilotPage, { orderId: mockOrderId })

    page.form.pilotField.shouldHaveOption('Licence Variation Project')
    cy.get('input[type="radio"][value="LICENCE_VARIATION_PROJECT"]').should('be.enabled')
  })

  it('hdc yes', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })

    hdcPage.form.fillInWith('Yes')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })

    pilotPage.form.pilotField.shouldHaveOption('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.pilotField.shouldHaveOption('GPS acquisitive crime (EMAC)')
    pilotPage.form.pilotField.shouldHaveOption('They are not part of any of these pilots')

    pilotPage.form.fillInWith('They are not part of any of these pilots')
  })

  it('hdc no', () => {
    const hdcPage = Page.visit(HdcPage, { orderId: mockOrderId })

    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const pilotPage = Page.verifyOnPage(PilotPage, { orderId: mockOrderId })

    pilotPage.form.pilotField.shouldHaveOption('Domestic Abuse Perpetrator on Licence (DAPOL)')
    pilotPage.form.pilotField.shouldHaveOption('GPS acquisitive crime (EMAC)')
    pilotPage.form.pilotField.shouldHaveOption('They are not part of any of these pilots')

    const hintText =
      'To be eligible for tagging the device wearer must either be part of a pilot or have Alcohol Monitoring on Licence (AML) as a licence condition.'
    pilotPage.form.pilotField.element.contains(hintText).should('be.hidden')
    pilotPage.form.fillInWith('They are not part of any of these pilots')
    pilotPage.form.pilotField.element.contains(hintText)
  })
})
