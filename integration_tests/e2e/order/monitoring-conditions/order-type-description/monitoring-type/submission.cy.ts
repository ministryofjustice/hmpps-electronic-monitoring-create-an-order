import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'
import InstallationLocationPage from '../../../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()
context('pilot', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        deviceWearer: {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          homeOfficeReferenceNumber: '',
          complianceAndEnforcementPersonReference: 'cepr',
          courtCaseReferenceNumber: 'ccrn',
          firstName: 'Eoforhild',
          lastName: 'Coello',
          alias: '',
          dateOfBirth: '2000-01-01T00:00:00Z',
          adultAtTimeOfInstallation: true,
          sex: 'FEMALE',
          gender: 'FEMALE',
          disabilities: 'MENTAL_HEALTH',
          otherDisability: null,
          noFixedAbode: false,
          interpreterRequired: false,
        },
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '5 The Avenue',
            addressLine2: '',
            addressLine3: 'London',
            addressLine4: 'England',
            postcode: 'SW21 2DX',
          },
        ],
      },
    })

    cy.signIn()
  })

  it('Should submit the form', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    page.form.fillInWith('Alcohol')
    page.form.continueButton.click()

    Page.verifyOnPage(InstallationLocationPage)
  })
})
