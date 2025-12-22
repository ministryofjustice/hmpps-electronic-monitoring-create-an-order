import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer'

context('About the device wearer', () => {
  context('Device wearer', () => {
    context('Submitting valid device wearer details', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            ceprId: null,
            ccrnId: null,
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: false,
            interpreterRequired: null,
          },
        })

        cy.signIn()
      })

      it('should include screen reader accessibility hint for radio button with secondary input', () => {
        Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        cy.get('input[value="OTHER"]')
          .closest('.govuk-checkboxes__item')
          .find('.govuk-checkboxes__hint')
          .find('span')
          .should('contain.text', 'Selecting this will reveal an additional input')
          .and('have.class', 'govuk-visually-hidden')

        cy.get('#interpreterRequired-item-hint').find('span').should('have.class', 'govuk-visually-hidden')
        cy.get('#interpreterRequired-item-hint').find('span').contains('Selecting this will reveal an additional input')
      })

      it('should continue to the identity numbers page', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: new Date('1970-01-01T00:00:00.000Z'),

          is18: true,
          sex: 'Male',
          genderIdentity: 'Male',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
          interpreterRequired: true,
          language: 'British Sign',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: true,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '1970-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            interpreterRequired: true,
            language: 'BRITISH_SIGN',
          },
        }).should('be.true')

        Page.verifyOnPage(IdentityNumbersPage)
      })

      it('should continue to the responsible adult page', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            ceprId: '1234567',
            ccrnId: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NONE',
            otherDisability: '',
            noFixedAbode: null,
            interpreterRequired: false,
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: new Date('2020-01-01T00:00:00.000Z'),

          is18: false,
          sex: 'Male',
          genderIdentity: 'Male',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
          interpreterRequired: false,
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            interpreterRequired: false,
            language: '',
          },
        }).should('be.true')

        Page.verifyOnPage(ResponsibleAdultPage)
      })

      it('should update device wearer other disabilities', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            ceprId: '1234567',
            ccrnId: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            noFixedAbode: null,
            interpreterRequired: false,
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: new Date('2020-01-01T00:00:00.000Z'),

          is18: false,
          sex: 'Male',
          genderIdentity: 'Male',
          interpreterRequired: false,
          disabilities: 'The device wearer has a disability or health condition not listed',
          otherDisability: 'Test disabilities',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'OTHER',
            otherDisability: 'Test disabilities',
            interpreterRequired: false,
            language: '',
          },
        }).should('be.true')

        Page.verifyOnPage(ResponsibleAdultPage)
      })

      it('should pass interpreter required as false', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            ceprId: '1234567',
            ccrnId: '1234567',
            firstName: 'Sigmund',
            lastName: 'Ora',
            alias: 'Sig',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            noFixedAbode: null,
            interpreterRequired: false,
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Sigmund',
          lastName: 'Ora',
          alias: 'Sig',
          dob: new Date('2020-01-01T00:00:00.000Z'),
          is18: false,
          sex: 'Male',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
          genderIdentity: 'Male',
          interpreterRequired: false,
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Sigmund',
            lastName: 'Ora',
            alias: 'Sig',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            interpreterRequired: false,
            language: '',
          },
        }).should('be.true')

        Page.verifyOnPage(ResponsibleAdultPage)
      })

      it('should pass interpreter required as true', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            ceprId: '1234567',
            ccrnId: '1234567',
            firstName: 'Sebastien',
            lastName: 'Eden',
            alias: 'Bastien',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            noFixedAbode: null,
            interpreterRequired: true,
            language: 'FRENCH',
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Sebastien',
          lastName: 'Eden',
          alias: 'Bastien',
          dob: new Date('2020-01-01T00:00:00.000Z'),
          is18: false,
          sex: 'Male',
          genderIdentity: 'Male',
          interpreterRequired: true,
          language: 'French',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Sebastien',
            lastName: 'Eden',
            alias: 'Bastien',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            interpreterRequired: true,
            language: 'FRENCH',
          },
        }).should('be.true')

        Page.verifyOnPage(ResponsibleAdultPage)
      })

      it('should pass interpreter required as false when initial choice yes then no', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: '1234567',
            pncId: '1234567',
            deliusId: '1234567',
            prisonNumber: '1234567',
            ceprId: '1234567',
            ccrnId: '1234567',
            firstName: 'Nadir',
            lastName: 'Adnan',
            alias: '',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            noFixedAbode: null,
            interpreterRequired: false,
            language: '',
          },
        })

        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Nadir',
          lastName: 'Adnan',
          alias: '',
          dob: new Date('2020-01-01T00:00:00.000Z'),
          is18: false,
          sex: 'Male',
          genderIdentity: 'Male',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
          interpreterRequired: true,
          language: 'Arabic',
        }

        const changeInterpreterRequired = {
          interpreterRequired: false,
          language: '',
        }

        page.form.fillInWith(validFormData)
        page.form.fillInWith(changeInterpreterRequired)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            firstName: 'Nadir',
            lastName: 'Adnan',
            alias: '',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'MALE',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'NO_LISTED_CONDITION',
            otherDisability: '',
            interpreterRequired: false,
            language: '',
          },
        }).should('be.true')

        Page.verifyOnPage(ResponsibleAdultPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(AboutDeviceWearerPage, { orderId: mockOrderId })

        const validFormData = {
          firstNames: 'Barton',
          lastName: 'Fink',
          alias: 'Barty',

          dob: new Date('1970-01-01T00:00:00.000Z'),

          is18: true,
          sex: 'Male',
          genderIdentity: 'Male',
          disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
          interpreterRequired: true,
          language: 'British Sign',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
