import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import AdultAtInstallationPage, {
  RESPONSIBLE_ADULT_QUESTION,
} from '../../../pages/order/about-the-device-wearer/adult-at-installation'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import CheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import { NotifyingOrganisation } from '../../../../server/models/NotifyingOrganisation'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer'
const requiredError = 'Select yes if a responsible adult is required'

// Synthetic device wearer who has answered every page before the responsible adult question
const answeredDeviceWearer = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: 'Test',
  middleName: null,
  lastName: 'Wearer',
  alias: null,
  dateOfBirth: '2010-01-01T00:00:00.000Z',
  adultAtTimeOfInstallation: null,
  sex: 'MALE',
  gender: 'MALE',
  disabilities: 'NONE',
  otherDisability: null,
  noFixedAbode: null,
  interpreterRequired: false,
  language: '',
}

const stubOrder = (
  notifyingOrganisation: NotifyingOrganisation,
  adultAtTimeOfInstallation: boolean | null = null,
  status = 'IN_PROGRESS',
) =>
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status,
    order: {
      interestedParties: { notifyingOrganisation },
      deviceWearer: { ...answeredDeviceWearer, adultAtTimeOfInstallation },
    },
  })

const stubSubmit = (adultAtTimeOfInstallation: boolean) =>
  cy.task('stubCemoSubmitOrder', {
    httpStatus: 200,
    id: mockOrderId,
    subPath: apiPath,
    response: { ...answeredDeviceWearer, adultAtTimeOfInstallation },
  })

const shouldHaveSubmitted = (adultAtTimeOfInstallation: boolean) =>
  cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).then((requests: Array<Record<string, unknown>>) => {
    expect(requests).to.have.length(1)
    expect(requests[0]).to.have.property('adultAtTimeOfInstallation', adultAtTimeOfInstallation)
  })

context('About the device wearer', () => {
  context('Responsible adult question', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    })

    const youthOrPrison: NotifyingOrganisation[] = ['YOUTH_CUSTODY_SERVICE', 'YOUTH_COURT', 'PRISON']

    youthOrPrison.forEach(notifyingOrganisation => {
      context(`${notifyingOrganisation} order`, () => {
        it('shows the question with nothing selected and is accessible', () => {
          stubOrder(notifyingOrganisation)
          cy.signIn()

          const page = Page.visit(AdultAtInstallationPage, { orderId: mockOrderId })

          page.form.responsibleAdultRequiredField.shouldNotHaveValue()
          page.form.continueButton.should('exist')
          page.form.saveAsDraftButton.should('not.exist')
          page.checkIsAccessible()
        })

        it('shows an error when nothing is selected', () => {
          stubOrder(notifyingOrganisation)
          cy.signIn()

          const page = Page.visit(AdultAtInstallationPage, { orderId: mockOrderId })
          page.form.continueButton.click()

          Page.verifyOnPage(AdultAtInstallationPage)
          page.errorSummary.shouldHaveError(requiredError)
          page.form.responsibleAdultRequiredField.shouldHaveValidationMessage(requiredError)
        })

        it('goes to the responsible adult details page when Yes is selected', () => {
          stubOrder(notifyingOrganisation)
          stubSubmit(false)
          cy.signIn()

          const page = Page.visit(AdultAtInstallationPage, { orderId: mockOrderId })
          page.form.fillInWith('Yes')
          page.form.continueButton.click()

          shouldHaveSubmitted(false)
          Page.verifyOnPage(ResponsibleAdultPage)
        })

        it('goes to the contact number page when No is selected', () => {
          stubOrder(notifyingOrganisation)
          stubSubmit(true)
          cy.signIn()

          const page = Page.visit(AdultAtInstallationPage, { orderId: mockOrderId })
          page.form.fillInWith('No')
          page.form.continueButton.click()

          shouldHaveSubmitted(true)
          Page.verifyOnPage(ContactDetailsPage)
        })

        it('shows the question on check your answers, linking to the question page', () => {
          stubOrder(notifyingOrganisation, false)
          cy.signIn()

          const cya = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')
          cya.personDetailsSection.shouldHaveItem(RESPONSIBLE_ADULT_QUESTION, 'Yes')
          cya.personDetailsSection.changeAnswer(RESPONSIBLE_ADULT_QUESTION)

          const page = Page.verifyOnPage(AdultAtInstallationPage, { orderId: mockOrderId })
          page.form.responsibleAdultRequiredField.shouldHaveValue('Yes')
        })
      })
    })

    context('Submitted order', () => {
      it('shows the submitted answer, disabled, and continues to the summary without saving it', () => {
        stubOrder('YOUTH_COURT', true, 'SUBMITTED')
        cy.signIn()

        const page = Page.visit(AdultAtInstallationPage, { orderId: mockOrderId })

        page.form.responsibleAdultRequiredField.shouldHaveValue('No')
        page.form.responsibleAdultRequiredField.shouldBeDisabled()
        page.form.continueButton.should('exist')
        page.form.saveAsDraftButton.should('not.exist')

        page.form.continueButton.click()

        cy.location('pathname').should('eq', `/order/${mockOrderId}/summary`)
        cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).then((requests: unknown[]) => {
          expect(requests).to.have.length(0)
        })
      })
    })

    context('Other orders', () => {
      it('do not show the question on check your answers', () => {
        stubOrder('PROBATION', true)
        cy.signIn()

        const cya = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')
        cya.personDetailsSection.shouldNotHaveItem(RESPONSIBLE_ADULT_QUESTION)
      })

      it('skip the question when it is visited directly', () => {
        // Submitting "no responsible adult required" for these orders is covered by deviceWearerAnswersService.test.ts
        stubOrder('PROBATION')
        cy.signIn()

        cy.visit(`/order/${mockOrderId}/about-the-device-wearer/adult-at-installation`)

        Page.verifyOnPage(ContactDetailsPage)
        cy.contains(RESPONSIBLE_ADULT_QUESTION).should('not.exist')
      })
    })
  })
})
