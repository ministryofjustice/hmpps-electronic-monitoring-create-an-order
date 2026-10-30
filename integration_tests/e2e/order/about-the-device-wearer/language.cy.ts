import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import LanguagePage from '../../../pages/order/about-the-device-wearer/language'
import CheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import { NotifyingOrganisation } from '../../../../server/models/NotifyingOrganisation'

const apiPath = '/device-wearer'

const answeredDeviceWearer = {
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: 'Jo',
  middleName: null,
  lastName: 'Bloggs',
  alias: null,
  dateOfBirth: '1980-01-01T00:00:00Z',
  adultAtTimeOfInstallation: true,
  sex: 'MALE',
  gender: 'MALE',
  disabilities: 'VISION',
  otherDisability: null,
  noFixedAbode: null,
  interpreterRequired: null,
  language: null,
}

const expectedDeviceWearerSubmission = {
  firstName: 'Jo',
  middleName: null,
  lastName: 'Bloggs',
  alias: null,
  dateOfBirth: '1980-01-01T00:00:00Z',
  adultAtTimeOfInstallation: true,
  sex: 'MALE',
  gender: 'MALE',
  disabilities: 'VISION',
  otherDisability: null,
}

context('About the device wearer', () => {
  context('Language', () => {
    // The device wearer answers are cached per order, so each test uses its own order
    let orderId: string

    const stubOrder = (
      deviceWearer: Record<string, unknown>,
      status = 'IN_PROGRESS',
      notifyingOrganisation: NotifyingOrganisation | null = null,
    ) =>
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: orderId,
        status,
        order: {
          deviceWearer: { ...answeredDeviceWearer, ...deviceWearer },
          interestedParties: notifyingOrganisation ? { notifyingOrganisation } : null,
        },
      })

    beforeEach(() => {
      orderId = uuidv4()
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    it('asks whether an interpreter is needed and which language', () => {
      stubOrder({})

      const page = Page.visit(LanguagePage, { orderId })

      page.form.interpreterRequiredField.shouldHaveOption('Yes')
      page.form.interpreterRequiredField.shouldHaveOption('No')
      page.form.interpreterRequiredField.shouldHaveDivider('or')
      page.form.interpreterRequiredField.shouldHaveOption("Don't know")
      page.form.interpreterRequiredField.shouldNotHaveValue()
      cy.get('input#language').should('not.be.visible')
      page.checkIsAccessible()
      page.form.interpreterRequiredField.set('Yes')
      page.form.languageField.shouldHaveOption('Arabic')
      cy.get('input#language')
        .should('be.visible')
        .and('have.attr', 'role', 'combobox')
        .and('not.have.attr', 'aria-invalid')
      cy.get('input#language').invoke('attr', 'aria-describedby').should('include', 'language-hint')
      cy.get('#language-hint').should('have.length', 1).and('be.visible')
      page.checkIsAccessible()
      page.form.continueButton.should('exist')
      cy.contains('button', 'Save as draft').should('not.exist')
      page.errorSummary.shouldNotExist()
    })

    it('shows the saved answers', () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' })

      const page = Page.visit(LanguagePage, { orderId })

      page.form.interpreterRequiredField.shouldHaveValue('Yes')
      page.form.languageField.shouldHaveValue('Arabic')
      cy.get('input#language').should('be.visible').and('have.value', 'Arabic')
    })

    it('requires an answer', () => {
      stubOrder({})

      const page = Page.visit(LanguagePage, { orderId })
      page.form.continueButton.click()

      Page.verifyOnPage(LanguagePage, { orderId })
      page.errorSummary.shouldHaveError('Select yes if the device wearer requires an interpreter')
      page.form.interpreterRequiredField.shouldHaveValidationMessage(
        'Select yes if the device wearer requires an interpreter',
      )
    })

    it('requires a language when an interpreter is needed', () => {
      stubOrder({})

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: 'Yes' })
      page.form.continueButton.click()

      Page.verifyOnPage(LanguagePage, { orderId })
      page.errorSummary.shouldHaveError('Select the language required')
      cy.get('.govuk-error-summary a[href="#language"]').should('contain', 'Select the language required')
      page.form.languageField.shouldHaveValidationMessage('Select the language required')
      page.form.interpreterRequiredField.shouldHaveValue('Yes')
      // The language question stays revealed when the answers are shown again
      cy.get('input#language').should('be.visible').and('have.attr', 'aria-invalid', 'true')
      cy.get('input#language')
        .invoke('attr', 'aria-describedby')
        .should('include', 'language-hint')
        .and('include', 'language-error')
      cy.get('#language-error').should('have.length', 1).and('be.visible')
      page.checkIsAccessible()
      cy.get('.govuk-error-summary a[href="#language"]').click()
      cy.get('input#language').should('be.focused').type('Ara')
      cy.get('#language__listbox').should('be.visible').and('contain', 'Arabic')
      cy.get('input#language')
        .invoke('attr', 'aria-describedby')
        .should('include', 'language-hint')
        .and('include', 'language-error')
      cy.get('input#language').clear()
      cy.get('input#language').should('have.attr', 'aria-invalid', 'true')
      cy.get('input#language')
        .invoke('attr', 'aria-describedby')
        .should('include', 'language-hint')
        .and('include', 'language-error')
    })

    it('continues to the unanswered adult at installation page for a prison order', () => {
      stubOrder({ adultAtTimeOfInstallation: null }, 'IN_PROGRESS', 'PRISON')

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: 'No' })
      page.form.continueButton.click()

      cy.url().should('include', `/order/${orderId}/about-the-device-wearer/adult-at-installation`)
    })

    it('skips the unanswered adult at installation page for a probation order', () => {
      stubOrder({ adultAtTimeOfInstallation: null }, 'IN_PROGRESS', 'PROBATION')
      cy.task('stubCemoPutDeviceWearer', {
        httpStatus: 200,
        id: orderId,
        status: 'IN_PROGRESS',
        deviceWearer: { ...answeredDeviceWearer, interpreterRequired: false, language: '' },
      })

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: 'No' })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${orderId}${apiPath}`,
        method: 'PUT',
        body: { ...expectedDeviceWearerSubmission, interpreterRequired: false, language: '' },
      }).should('be.true')

      Page.verifyOnPage(ContactDetailsPage, { orderId })
    })

    it('submits the device wearer and continues to the contact number page when every page is answered', () => {
      stubOrder({})
      cy.task('stubCemoPutDeviceWearer', {
        httpStatus: 200,
        id: orderId,
        status: 'IN_PROGRESS',
        deviceWearer: { ...answeredDeviceWearer, interpreterRequired: true, language: 'Arabic' },
      })

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: 'Yes', language: 'Arabic' })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${orderId}${apiPath}`,
        method: 'PUT',
        body: {
          ...expectedDeviceWearerSubmission,
          interpreterRequired: true,
          language: 'Arabic',
        },
      }).should('be.true')

      Page.verifyOnPage(ContactDetailsPage, { orderId })
    })

    it("clears a saved language and submits don't know as no interpreter needed", () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' })
      cy.task('stubCemoPutDeviceWearer', {
        httpStatus: 200,
        id: orderId,
        status: 'IN_PROGRESS',
        deviceWearer: { ...answeredDeviceWearer, interpreterRequired: false, language: '' },
      })

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: "Don't know" })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${orderId}${apiPath}`,
        method: 'PUT',
        body: { ...expectedDeviceWearerSubmission, interpreterRequired: false, language: '' },
      }).should('be.true')

      Page.verifyOnPage(ContactDetailsPage, { orderId })
    })

    it('submits no language when a saved interpreter answer is changed to no', () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' })
      cy.task('stubCemoPutDeviceWearer', {
        httpStatus: 200,
        id: orderId,
        status: 'IN_PROGRESS',
        deviceWearer: { ...answeredDeviceWearer, interpreterRequired: false, language: '' },
      })

      const page = Page.visit(LanguagePage, { orderId })
      page.form.fillInWith({ interpreterRequired: 'No' })
      page.form.continueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${orderId}${apiPath}`,
        method: 'PUT',
        body: { ...expectedDeviceWearerSubmission, interpreterRequired: false, language: '' },
      }).should('be.true')
    })

    it('links the interpreter and language answers on check your answers to the language page', () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' })

      const cya = Page.visit(CheckYourAnswersPage, { orderId }, {}, 'Check your answers')
      cya.personDetailsSection.shouldExist()
      cya.changeLinkByQuestion('Is an interpreter needed?').click()
      Page.verifyOnPage(LanguagePage, { orderId })

      Page.visit(CheckYourAnswersPage, { orderId }, {}, 'Check your answers')
        .changeLinkByQuestion('What language does the interpreter need to use?')
        .click()
      Page.verifyOnPage(LanguagePage, { orderId })
    })

    it('shows the saved answers read-only on a submitted order', () => {
      stubOrder({ interpreterRequired: false }, 'SUBMITTED')

      const page = Page.visit(LanguagePage, { orderId })

      page.form.interpreterRequiredField.shouldHaveValue('No')
      page.form.interpreterRequiredField.shouldBeDisabled()

      page.form.continueButton.click()
      cy.url().should('include', `/order/${orderId}/summary`)
    })

    it('shows a saved interpreter and language on a submitted order', () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' }, 'SUBMITTED')

      const page = Page.visit(LanguagePage, { orderId })

      page.form.interpreterRequiredField.shouldHaveValue('Yes')
      page.form.interpreterRequiredField.shouldBeDisabled()
      cy.get('select#language').should('be.visible').and('have.value', 'Arabic')
    })

    it('disables the language on a submitted order', () => {
      stubOrder({ interpreterRequired: true, language: 'Arabic' }, 'SUBMITTED')

      const page = Page.visit(LanguagePage, { orderId })

      cy.get('select#language').should('be.visible').and('be.disabled').and('have.value', 'Arabic')
      cy.get('select#language').should('have.attr', 'aria-describedby', 'language-hint')
      cy.get('input#language, #language-select').should('not.exist')
      page.checkIsAccessible()
    })
  })
})
