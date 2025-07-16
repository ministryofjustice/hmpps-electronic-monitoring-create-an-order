import { v4 as uuidv4 } from 'uuid'
import { fakerEN_GB as faker } from '@faker-js/faker'
import Page from '../../../pages/page'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'

const mockOrderId = uuidv4()
const apiPath = '/installation-and-risk'
const possibleRiskError = 'Possible Risk is required'
context('Access needs and installation risk information', () => {
  context('Installation and Risk', () => {
    context('Submitting invalid installation and risk information', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [{ field: 'possibleRisk', error: possibleRiskError }],
        })

        cy.signIn()
      })

      // it('should display error when no possible risk selected', () => {
      //   const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

      //   const validFormData = {
      //     offence: 'Robbery',
      //     riskDetails: '',
      //     mappaLevel: 'MAPPA 1',
      //     mappaCaseType: 'Serious Organised Crime',
      //   }

      //   page.form.fillInWith(validFormData)
      //   page.form.saveAndContinueButton.click()

      //   Page.verifyOnPage(InstallationAndRiskPage)
      //   page.form.possibleRiskField.shouldHaveValidationMessage(
      //     "Select all the possible risks from the device wearer's behaviour",
      //   )
      //   page.errorSummary.shouldHaveError("Select all the possible risks from the device wearer's behaviour")
      // })

      it('should display error when no riskDetails selected', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          possibleRisk: 'Sex offender',
          riskDetails: '',
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAndRiskPage)
        page.form.riskDetailsField.shouldHaveValidationMessage('Enter any other risks to be aware of')
        page.errorSummary.shouldHaveError('Enter any other risks to be aware of')
      })

      it('should display error message', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          riskCategory: 'History of substance abuse',
          riskDetails: '',
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
          possibleRisk: 'Sex offender',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAndRiskPage)
        page.form.riskDetailsField.shouldHaveValidationMessage('Enter any other risks to be aware of')
        page.errorSummary.shouldHaveError('Enter any other risks to be aware of')
      })

      it('should display error message when risk details is longer than 200 charactger', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          riskCategory: 'History of substance abuse',
          riskDetails: faker.string.fromCharacters(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            201,
          ),
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
          possibleRisk: 'Sex offender',
        }

        page.form.fillInWith(validFormData)
        page.form.riskDetailsField.shouldHaveValidationMessage('You have 1 character too many')
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InstallationAndRiskPage)
        page.form.riskDetailsField.shouldHaveValidationMessage(
          'Any other risks to be aware of must be 350 characters or less',
        )
        page.errorSummary.shouldHaveError('Any other risks to be aware of must be 350 characters or less')
      })
    })
  })
})
