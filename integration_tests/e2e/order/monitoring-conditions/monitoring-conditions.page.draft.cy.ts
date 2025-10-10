import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'

const mockOrderId = uuidv4()

context('Monitoring conditions', () => {
  context('Index', () => {
    context('Viewing a draft order with no saved data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            deviceWearer: {
              nomisId: 'nomis',
              pncId: 'pnc',
              deliusId: 'delius',
              prisonNumber: 'prison',
              homeOfficeReferenceNumber: 'ho',
              firstName: 'test',
              lastName: 'tester',
              alias: 'tes',
              dateOfBirth: '2000-01-01T00:00:00Z',
              adultAtTimeOfInstallation: true,
              sex: 'MALE',
              gender: 'MALE',
              disabilities: 'MENTAL_HEALTH',
              otherDisability: null,
              noFixedAbode: null,
              interpreterRequired: false,
            },
            addresses: [
              {
                addressType: 'PRIMARY',
                addressLine1: '10 Downing Street',
                addressLine2: '',
                addressLine3: '',
                addressLine4: '',
                postcode: '',
              },
            ],
            dataDictionaryVersion: 'DDV5',
          },
        })

        cy.signIn()
      })

      it('Should display contents', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.shouldNotBeDisabled()
        page.backButton.should('exist')
        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.errorSummary.shouldNotExist()

        page.form.startDateField.shouldNotHaveValue(false)
        page.form.endDateField.shouldNotHaveValue(false)
        page.form.orderTypeField.shouldHaveValue('POST_RELEASE')
        page.form.orderTypeField.element.should('be.hidden')
        page.form.pilotField.shouldNotHaveValue()
        page.form.sentenceTypeField.shouldNotHaveValue()
        page.form.isspField.shouldNotHaveValue()
        page.form.hdcField.shouldNotHaveValue()
        page.form.prarrField.shouldNotHaveValue()
        page.form.monitoringRequiredField.shouldNotHaveValue()

        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="alcohol"]').should('be.disabled')

        page.form.shouldHaveAllOptions()
      })

      it('should show orderTypeDescriptionField when order data dictionary version is DDv4', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: { dataDictionaryVersion: 'DDV4' },
        })

        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })

        page.form.orderTypeDescriptionField.shouldHaveAllOptions()
      })

      context('when alcohol monitoring is enabled', () => {
        const testFlags = { ALCOHOL_MONITORING_ENABLED: true }
        beforeEach(() => {
          cy.task('setFeatureFlags', testFlags)
        })

        afterEach(() => {
          cy.task('resetFeatureFlags')
        })

        it('alcohol monitoring field should be enabled', () => {
          const page = Page.visit(MonitoringConditionsPage, {
            orderId: mockOrderId,
          })
          page.form.monitoringRequiredField.element.find('input[type=checkbox][value="alcohol"]').should('be.enabled')
          page.form.monitoringRequiredField.element.contains(
            'Measuring alcohol levels of the device wearer or recording they are abstaining from drinking alcohol.',
          )
        })
      })

      // Test disabled because the hint text of the disabled Alcohol Monitoring order type checkbox is too low contrast to meet WCAG 2 AA accessibility standards. This is a known issue in the GOV.UK design system. This test should be enabled again when this design system issue is resolved or the Alcohol Monitoring checkbox is enabled.
      it.skip('Should be accessible', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.checkIsAccessible()
      })
    })

    context('Viewing a draft order with no fixed address', () => {
      const testFlags = { ALCOHOL_MONITORING_ENABLED: true }

      afterEach(() => {
        cy.task('resetFeatureFlags')
      })
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('setFeatureFlags', testFlags)
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            dataDictionaryVersion: 'DDV5',
            deviceWearer: {
              nomisId: 'nomis',
              pncId: 'pnc',
              deliusId: 'delius',
              prisonNumber: 'prison',
              homeOfficeReferenceNumber: 'ho',
              firstName: 'test',
              lastName: 'tester',
              alias: 'tes',
              dateOfBirth: '2000-01-01T00:00:00Z',
              adultAtTimeOfInstallation: true,
              sex: 'MALE',
              gender: 'MALE',
              disabilities: 'MENTAL_HEALTH',
              otherDisability: null,
              noFixedAbode: null,
              interpreterRequired: false,
            },
          },
        })

        cy.signIn()
      })

      it('All monitoring condition but Alcohol is disabled', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="curfew"]').should('be.disabled')
        page.form.monitoringRequiredField.element
          .find('input[type=checkbox][value="exclusionZone"]')
          .should('be.disabled')
        page.form.monitoringRequiredField.element
          .find('input[type=checkbox][value="mandatoryAttendance"]')
          .should('be.disabled')
        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="trail"]').should('be.disabled')
        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="alcohol"]').should('be.enabled')

        page.form.shouldHaveAllOptions()
      })
    })

    context('Viewing a draft order where device wearer is youth', () => {
      const testFlags = { ALCOHOL_MONITORING_ENABLED: true }

      afterEach(() => {
        cy.task('resetFeatureFlags')
      })
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('setFeatureFlags', testFlags)
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            dataDictionaryVersion: 'DDV5',
            deviceWearer: {
              nomisId: 'nomis',
              pncId: 'pnc',
              deliusId: 'delius',
              prisonNumber: 'prison',
              homeOfficeReferenceNumber: 'ho',
              firstName: 'test',
              lastName: 'tester',
              alias: 'tes',
              dateOfBirth: '2000-01-01T00:00:00Z',
              adultAtTimeOfInstallation: false,
              sex: 'MALE',
              gender: 'MALE',
              disabilities: 'MENTAL_HEALTH',
              otherDisability: null,
              noFixedAbode: null,
              interpreterRequired: false,
            },
            addresses: [
              {
                addressType: 'PRIMARY',
                addressLine1: '10 Downing Street',
                addressLine2: '',
                addressLine3: '',
                addressLine4: '',
                postcode: '',
              },
            ],
          },
        })

        cy.signIn()
      })

      it('Alcohol is disabled', () => {
        const page = Page.visit(MonitoringConditionsPage, {
          orderId: mockOrderId,
        })
        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.monitoringRequiredField.element.find('input[type=checkbox][value="alcohol"]').should('be.disabled')
        cy.contains(
          '.govuk-inset-text',
          'Alcohol monitoring is not an option because the device wearer is not 18 years old or older when the electonic monitoring device is installed.',
        )
      })
    })
  })
})
