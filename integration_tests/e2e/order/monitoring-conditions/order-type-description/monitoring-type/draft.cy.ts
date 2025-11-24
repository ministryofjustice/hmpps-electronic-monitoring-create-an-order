import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'
import { MonitoringConditions } from '../../../../../../server/routes/monitoring-conditions/model'

const createDevicerWearer = (youth: boolean = true) => {
  return {
    nomisId: 'nomis',
    pncId: 'pnc',
    deliusId: 'delius',
    prisonNumber: 'prison',
    homeOfficeReferenceNumber: 'ho',
    firstName: 'test',
    lastName: 'tester',
    alias: 'tes',
    dateOfBirth: '2000-01-01T00:00:00Z',
    adultAtTimeOfInstallation: youth,
    sex: 'MALE',
    gender: 'MALE',
    disabilities: 'MENTAL_HEALTH',
    otherDisability: null,
    noFixedAbode: null,
    interpreterRequired: false,
  }
}

const createAddresses = (noFixedAddress: boolean = false) => {
  if (noFixedAddress) {
    return []
  }
  return [
    {
      addressType: 'PRIMARY',
      addressLine1: '10 Downing Street',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
    },
  ]
}

const createMonitoringConditions = (override: Partial<MonitoringConditions> = {}) => {
  return {
    startDate: null,
    endDate: null,
    orderType: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    conditionType: null,
    orderTypeDescription: null,
    sentenceType: null,
    issp: null,
    hdc: null,
    prarr: null,
    pilot: null,
    offenceType: null,
    policeArea: null,
    ...override,
  }
}

const stubGetOrder = ({
  notifyingOrg = 'PROBATION',
  deviceWearer = createDevicerWearer(),
  addresses = createAddresses(),
  monitoringConditions = createMonitoringConditions(),
  curfewConditions = null,
  curfewReleaseDateConditions = null,
  curfewTimeTable = [],
  monitoringConditionsTrail = null,
  monitoringConditionsAlcohol = null,
} = {}) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
      deviceWearer,
      addresses,
      monitoringConditions,
      curfewConditions,
      curfewReleaseDateConditions,
      curfewTimeTable,
      monitoringConditionsTrail,
      monitoringConditionsAlcohol,
    },
  })
}

const mockOrderId = uuidv4()
context('monitoring types', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    stubGetOrder()

    cy.signIn()
  })

  it('Page accessisble', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.monitoringTypesField.shouldExist()
    page.form.monitoringTypesField.shouldNotBeDisabled()
    page.form.monitoringTypesField.shouldHaveOption('Curfew')
    page.form.monitoringTypesField.shouldHaveOption('Exclusion zone monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Trail monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Mandatory attendance monitoring')
    page.form.monitoringTypesField.shouldHaveOption('Alcohol monitoring')

    page.form.continueButton.should('exist')

    page.form.ReturnToMonitoringListPageButton.should('not.exist')
  })

  it('hdc no, pilot unknown', () => {
    stubGetOrder({ monitoringConditions: createMonitoringConditions({ hdc: 'NO', pilot: 'UNKNOWN' }) })
    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Curfew')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Exclusion zone monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Trail')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Mandatory attendance monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Alcohol')
    monitoringTypesPage.form.message.contains(
      "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC) or part of any pilots.",
    )
  })

  it('hdc no, pilot GPS', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({ hdc: 'NO', pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE' }),
    })
    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Curfew')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Exclusion zone monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Trail')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Mandatory attendance monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Alcohol')
    monitoringTypesPage.form.message.contains(
      "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC).",
    )
  })

  it('no fixed address', () => {
    stubGetOrder({ notifyingOrg: 'PROBATION', addresses: createAddresses(true) })
    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Curfew')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Exclusion zone monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Trail')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Mandatory attendance monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Alcohol')
    monitoringTypesPage.form.message.contains(
      "Some monitoring types can't be selected because the device wearer has no fixed address.",
    )
  })

  it('youth', () => {
    stubGetOrder({ notifyingOrg: 'PROBATION', deviceWearer: createDevicerWearer(false) })
    const monitoringTypesPage = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Curfew')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Exclusion zone monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Trail')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveOption('Mandatory attendance monitoring')
    monitoringTypesPage.form.monitoringTypesField.shouldHaveDisabledOption('Alcohol')
    monitoringTypesPage.form.message.contains(
      'Alcohol monitoring is not an option because the device wearer is not 18 years old or older when the electonic monitoring device is installed.',
    )
  })

  it('curfew already added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({ curfew: true }),
      curfewReleaseDateConditions: {
        curfewAddress: null,
        endTime: null,
        orderId: null,
        releaseDate: null,
        startTime: null,
      },
      curfewConditions: {
        curfewAddress: null,
        endDate: null,
        orderId: null,
        startDate: null,
        curfewAdditionalDetails: null,
      },
      curfewTimeTable: [
        {
          curfewAddress: '',
          dayOfWeek: '',
          endTime: '',
          orderId: '',
          startTime: '',
        },
      ],
    })

    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.form.monitoringTypesField.shouldHaveDisabledOption('Curfew')
  })

  it('trail already added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({ trail: true }),
      monitoringConditionsTrail: { startDate: null, endDate: null },
    })

    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.form.monitoringTypesField.shouldHaveDisabledOption('Trail')
  })

  it('alcohol already added', () => {
    stubGetOrder({
      monitoringConditions: createMonitoringConditions({ alcohol: true }),
      monitoringConditionsAlcohol: {
        endDate: null,
        installationLocation: null,
        monitoringType: null,
        prisonName: null,
        probationOfficeName: null,
        startDate: null,
      },
    })

    const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

    page.form.monitoringTypesField.shouldHaveDisabledOption('Alcohol')
  })

  context('No condition available', () => {
    it('should disable continue button', () => {
      stubGetOrder({
        monitoringConditions: createMonitoringConditions({ alcohol: true, hdc: 'NO', pilot: 'UNKNOWN' }),
        monitoringConditionsAlcohol: {
          endDate: null,
          installationLocation: null,
          monitoringType: null,
          prisonName: null,
          probationOfficeName: null,
          startDate: null,
        },
      })

      const page = Page.visit(MonitoringTypesPage, { orderId: mockOrderId })

      page.form.monitoringTypesField.shouldHaveDisabledOption('Alcohol')
      page.form.monitoringTypesField.shouldHaveDisabledOption('Trail')
      page.form.monitoringTypesField.shouldHaveDisabledOption('Exclusion zone monitoring')
      page.form.monitoringTypesField.shouldHaveDisabledOption('Curfew')
      page.form.monitoringTypesField.shouldHaveDisabledOption('Mandatory attendance monitoring')
      page.form.ReturnToMonitoringListPageButton.should('exist')
      page.form.continueButton.should('be.disabled')
    })
  })
})
