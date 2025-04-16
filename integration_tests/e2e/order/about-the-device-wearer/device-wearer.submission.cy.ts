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
            homeOfficeReferenceNumber: null,
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
            gender: 'male',
            dateOfBirth: '1970-01-01T00:00:00.000Z',
            disabilities: '',
            otherDisability: '',
            interpreterRequired: true,
            language: 'British Sign',
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
            homeOfficeReferenceNumber: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'male',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: '',
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
            gender: 'male',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: '',
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
            homeOfficeReferenceNumber: '1234567',
            firstName: 'Barton',
            lastName: 'Fink',
            alias: 'Barty',
            adultAtTimeOfInstallation: false,
            sex: 'MALE',
            gender: 'male',
            otherGender: '',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: '',
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
            gender: 'male',
            otherGender: '',
            dateOfBirth: '2020-01-01T00:00:00.000Z',
            disabilities: 'OTHER',
            otherDisability: 'Test disabilities',
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
          interpreterRequired: true,
          language: 'British Sign',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
