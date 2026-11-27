import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import DisabilitiesPage from '../../../pages/order/about-the-device-wearer/disabilities'
import CheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import paths from '../../../../server/constants/paths'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer'

const personalDetailsAnswered = {
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
  adultAtTimeOfInstallation: null,
  sex: 'FEMALE',
  gender: 'FEMALE',
  disabilities: '',
  otherDisability: null,
  noFixedAbode: null,
  interpreterRequired: null,
  language: null,
}

const stubOrder = (status: string, deviceWearer: object, dataDictionaryVersion = 'DDV4') =>
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    status,
    order: { deviceWearer, dataDictionaryVersion },
  })

context('About the device wearer', () => {
  context('Disability and health conditions', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    it('shows the question and help text without an unlisted condition input', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

      page.form.disabilitiesField.shouldHaveAllOptions()
      page.form.disabilitiesField.shouldNotHaveOption('Prefer not to say')
      cy.get('h1').should('have.length', 1)
      cy.contains(
        "Provide disability or health conditions information to help plan installation. Answer questions based on what you know about the device wearer's access needs and requirements.",
      ).should('be.visible')
      page.form.otherDisabilityField.should('not.exist')
      page.form.disabilitiesField.set('The device wearer has a disability or health condition not listed')
      page.form.otherDisabilityField.should('not.exist')
      page.form.continueButton.should('exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.errorSummary.shouldNotExist()
    })

    it('shows the data dictionary v5 options', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered, 'DDV5')

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

      page.form.disabilitiesFieldDDv5.shouldHaveAllOptions()
      page.form.disabilitiesFieldDDv5.shouldNotHaveOption('Prefer not to say')
    })

    it('shows previously saved answers', () => {
      stubOrder('IN_PROGRESS', { ...personalDetailsAnswered, disabilities: 'VISION,MOBILITY' })

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

      page.form.disabilitiesField.shouldHaveValue('Visual impairment or blindness not corrected by wearing glasses')
      page.form.disabilitiesField.shouldHaveValue('Physical disability or mobility issue')
    })

    it('shows a validation error when nothing is selected', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.continueButton.click()

      const errorPage = Page.verifyOnPage(DisabilitiesPage)
      errorPage.form.disabilitiesField.shouldHaveValidationMessage(
        'Select if the device wearer has any disability or health conditions',
      )
      errorPage.errorSummary.shouldHaveError('Select if the device wearer has any disability or health conditions')
    })
    ;(['macbook-13', 'iphone-x'] as const).forEach(viewport => {
      it(`makes the last two checkboxes exclusive on ${viewport}`, () => {
        cy.viewport(viewport)
        stubOrder('IN_PROGRESS', personalDetailsAnswered)

        const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

        ;['NO_LISTED_CONDITION', 'NONE'].forEach(value => {
          page.form.disabilitiesField.element.find('input[value="VISION"]').check()
          page.form.disabilitiesField.element.find('input[value="OTHER"]').check()
          page.form.disabilitiesField.element.find(`input[value="${value}"]`).check()
          page.form.disabilitiesField.element.find('input:checked').should('have.length', 1).and('have.value', value)
          page.form.disabilitiesField.element.find('input[value="MOBILITY"]').check()
          page.form.disabilitiesField.element.find(`input[value="${value}"]`).should('not.be.checked')
        })

        page.form.disabilitiesField.element.find('input[value="NO_LISTED_CONDITION"]').check()
        page.form.disabilitiesField.element.find('input[value="NONE"]').check()
        page.form.disabilitiesField.element.find('input:checked').should('have.length', 1).and('have.value', 'NONE')
        cy.document().then(document => {
          expect(document.documentElement.scrollWidth).to.be.at.most(document.documentElement.clientWidth)
        })
        cy.injectAxe()
        cy.checkA11y('main')
        cy.screenshot(`disabilities-${viewport}`, { capture: 'fullPage' })
      })
    })

    it('accepts an unlisted condition without a description and retains the selection on revisiting', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.set('The device wearer has a disability or health condition not listed')
      page.form.continueButton.click()

      cy.location('pathname').should('eq', paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', mockOrderId))

      const revisitedPage = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      revisitedPage.form.disabilitiesField.shouldHaveValue(
        'The device wearer has a disability or health condition not listed',
      )
      revisitedPage.form.otherDisabilityField.should('not.exist')
      revisitedPage.checkIsAccessible()
    })

    it('goes to the language page on continue when language has not been answered', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.set('Mental health condition')
      page.form.continueButton.click()

      cy.location('pathname').should('eq', paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', mockOrderId))
    })

    it('submits an unlisted condition without the removed description', () => {
      stubOrder('IN_PROGRESS', {
        ...personalDetailsAnswered,
        disabilities: 'OTHER',
        otherDisability: 'Broken arm',
        interpreterRequired: false,
        adultAtTimeOfInstallation: true,
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: {
          ...personalDetailsAnswered,
          disabilities: 'OTHER',
          otherDisability: '',
          interpreterRequired: false,
        },
      })

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.shouldHaveValue('The device wearer has a disability or health condition not listed')
      page.form.otherDisabilityField.should('not.exist')
      page.form.continueButton.click()

      cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).then(requests => {
        expect(requests).to.have.length(1)
        expect(requests[0]).to.deep.include({ disabilities: 'OTHER', otherDisability: '' })
      })
    })

    it('clears the description when OTHER is unselected', () => {
      stubOrder('IN_PROGRESS', {
        ...personalDetailsAnswered,
        disabilities: 'OTHER',
        otherDisability: 'Broken arm',
        interpreterRequired: false,
        adultAtTimeOfInstallation: true,
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: { ...personalDetailsAnswered, disabilities: 'NONE', interpreterRequired: false },
      })

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.element.find('input[value="OTHER"]').uncheck()
      page.form.otherDisabilityField.should('not.exist')
      page.form.disabilitiesField.set('Not able to provide this information')
      page.form.continueButton.click()

      cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).then(requests => {
        expect(requests).to.have.length(1)
        expect(requests[0]).to.deep.include({ disabilities: 'NONE', otherDisability: null })
      })
    })

    it('is read only for a submitted order', () => {
      stubOrder('SUBMITTED', {
        ...personalDetailsAnswered,
        disabilities: 'HEARING,OTHER',
        otherDisability: 'Broken arm',
      })

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

      page.form.disabilitiesField.shouldHaveValue('Deafness or serious hearing impairment')
      page.form.disabilitiesField.shouldBeDisabled()
      page.form.otherDisabilityField.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.checkIsAccessible()

      page.form.continueButton.click()

      cy.location('pathname').should('eq', paths.ORDER.SUMMARY.replace(':orderId', mockOrderId))
      page.errorSummary.shouldNotExist()
    })

    it('is linked from the check your answers page', () => {
      stubOrder('IN_PROGRESS', { ...personalDetailsAnswered, disabilities: 'HEARING' })

      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')

      page.personDetailsSection
        .getChangeLink('Does the device wearer have any of the disabilities or health conditions listed?')
        .should('have.attr', 'href', paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', mockOrderId))
    })
  })
})
