import { v4 as uuidv4 } from 'uuid'
import ResponsibleOrganisationPage from './responsibleOrganisationPage'
import Page from '../../../../pages/page'
import ProbationDeliveryUnitPage from '../probation-delivery-unit/probationDeliveryUnitPage'
import InterestedPartiesCheckYourAnswersPage from '../check-your-answers/interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('order type', () => {
  const submitPath = '/interested-parties'
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: submitPath,
      method: 'PUT',
      response: {
        notifyingOrganisation: 'PRISON',
        responsibleOrganisation: 'PROBATION',
      },
    })
    cy.signIn()
  })

  it('if responsible organisation is probation routes to PDU page', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      responsibleOrganisation: 'Probation',
      probationRegion: 'Wales',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'WALES',
        responsibleOrganisationEmail: 'a@b.com',
      },
    }).should('be.true')
    Page.verifyOnPage(ProbationDeliveryUnitPage)
  })

  it('Should able to continue without responsible organisation email', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      responsibleOrganisation: 'Probation',
      probationRegion: 'Wales',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'WALES',
        responsibleOrganisationEmail: '',
      },
    }).should('be.true')
    Page.verifyOnPage(ProbationDeliveryUnitPage)
  })

  it('if responsible organisation is not probation routes to CYA page', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      responsibleOrganisation: 'Police',
      policeArea: 'Lancashire',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        responsibleOrganisation: 'POLICE',
        responsibleOrganisationRegion: 'LANCASHIRE',
        responsibleOrganisationEmail: 'a@b.com',
      },
    }).should('be.true')
    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  })

  it('navigating back to the page after submission shows values without org name', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      responsibleOrganisation: 'Home Office',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: 'a@b.com',
      },
    }).should('be.true')
    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)

    Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.responsibleOrganisationField.shouldHaveValue('Home Office')
    page.form.responsibleOrganisationEmailAddressField.shouldHaveValue('a@b.com')
  })

  it('navigating back to the page after submission shows values with org name', () => {
    const page = Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      responsibleOrganisation: 'Probation',
      probationRegion: 'Wales',
      responsibleOrganisationEmailAddress: 'a@b.com',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'WALES',
        responsibleOrganisationEmail: 'a@b.com',
      },
    }).should('be.true')
    Page.visit(ResponsibleOrganisationPage, { orderId: mockOrderId })
    page.form.responsibleOrganisationField.shouldHaveValue('Probation')
    page.form.responsibleOrgProbationField.shouldHaveValue('WALES')
    page.form.responsibleOrganisationEmailAddressField.shouldHaveValue('a@b.com')
  })
})
