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

    it('shows the description input only when the not-listed checkbox is selected', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })

      page.form.disabilitiesField.shouldHaveAllOptions()
      page.form.disabilitiesField.shouldNotHaveOption('Prefer not to say')
      page.form.otherDisabilityField.should('not.be.visible')
      page.form.disabilitiesField.set('The device wearer has a disability or health condition not listed')
      page.form.otherDisabilityField.should('be.visible').and('have.attr', 'id', 'otherDisability')
      cy.get('label[for="otherDisability"]')
        .should('be.visible')
        .and('contain.text', "What is the device wearer's disability or health condition?")
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

    it('requires a description and redisplays all selected conditions', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.set([
        'Mental health condition',
        'The device wearer has a disability or health condition not listed',
      ])
      page.form.continueButton.click()

      const errorPage = Page.verifyOnPage(DisabilitiesPage)
      errorPage.errorSummary.shouldHaveError("Enter the device wearer's disability or health condition")
      cy.get('a[href="#otherDisability"]').should('be.visible')
      errorPage.form.disabilitiesField.shouldHaveValue('Mental health condition')
      errorPage.form.disabilitiesField.shouldHaveValue(
        'The device wearer has a disability or health condition not listed',
      )
      errorPage.form.otherDisabilityField
        .should('be.visible')
        .and('have.value', '')
        .and('have.attr', 'aria-describedby', 'otherDisability-error')
      cy.get('a[href="#otherDisability"]').click()
      errorPage.form.otherDisabilityField.should('be.focused')
      errorPage.checkIsAccessible()
    })

    it('retains the description when continuing and revisiting cached answers', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.set('The device wearer has a disability or health condition not listed')
      page.form.otherDisabilityField.type('Broken arm')
      page.form.continueButton.click()

      cy.location('pathname').should('eq', paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', mockOrderId))

      const revisitedPage = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      revisitedPage.form.disabilitiesField.shouldHaveValue(
        'The device wearer has a disability or health condition not listed',
      )
      revisitedPage.form.otherDisabilityField.should('be.visible').and('have.value', 'Broken arm')
      revisitedPage.checkIsAccessible()
    })

    it('goes to the language page on continue when language has not been answered', () => {
      stubOrder('IN_PROGRESS', personalDetailsAnswered)

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.set('Mental health condition')
      page.form.continueButton.click()

      cy.location('pathname').should('eq', paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', mockOrderId))
    })

    it('prefills and submits the unlisted condition description when OTHER remains selected', () => {
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
          otherDisability: 'Broken arm',
          interpreterRequired: false,
        },
      })

      const page = Page.visit(DisabilitiesPage, { orderId: mockOrderId })
      page.form.disabilitiesField.shouldHaveValue('The device wearer has a disability or health condition not listed')
      page.form.otherDisabilityField.should('be.visible').and('have.value', 'Broken arm')
      page.form.continueButton.click()

      cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).then(requests => {
        expect(requests).to.have.length(1)
        expect(requests[0]).to.deep.include({ disabilities: 'OTHER', otherDisability: 'Broken arm' })
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
      page.form.otherDisabilityField.should('not.be.visible')
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
      page.form.otherDisabilityField.should('have.value', 'Broken arm').and('be.disabled')
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
