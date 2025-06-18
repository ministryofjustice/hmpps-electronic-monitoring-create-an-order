import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../pages/error'
import Page from '../../../pages/page'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

const mockOrderId = uuidv4()
const pagePath = '/contact-information/check-your-answers'

context('Contact Information - check your answers', () => {
  context('Draft order', () => {
    const pageHeading = 'Check your answers'
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.checkIsAccessible()
    })
  })

  context('Device Wearer has no fixed address', () => {
    const testFlags = { DD_V5_1_ENABLED: true }
    beforeEach(() => {
      cy.task('setFeatureFlags', testFlags)
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })
    const pageHeading = 'Check your answers'

    it('should not show addresses section', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'No' },
      ])

      page.deviceWearerAddressesSection.shouldNotHaveItems([
        "What is the device wearer's main address?",
        "What is the device wearer's second address?",
        "What is the device wearer's third address?",
      ])
      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])
    })

    it('should show prison name', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'BEDFORD_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOfficerPhoneNumber: '01234567891',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Prison' },
        { key: 'Select the name of the Prison', value: 'Bedford Prison' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the Probation region',
      ])
    })

    it('should show Crown court name', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'CROWN_COURT',
            notifyingOrganisationName: 'YORK_CROWN_COURT',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Crown Court' },
        { key: 'Select the name of the Crown Court', value: 'York Crown Court' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Prison',
        'Select the name of the Court',
        'Select the Probation region',
      ])
    })

    it('should show Magistrates court name', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'MAGISTRATES_COURT',
            notifyingOrganisationName: 'BLACKBURN_MAGISTRATES_COURT',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Magistrates Court' },
        { key: 'Select the name of the Court', value: 'Blackburn Magistrates Court' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Prison',
        'Select the name of the Crown Court',
        'Select the Probation region',
      ])
    })

    it('should show the responsible organisation Probation region', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'PROBATION',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'NORTH_EAST',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
          probationDeliveryUnit: {
            unit: 'SUNDERLAND',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Officer's organisation?", value: 'Probation' },
        { key: 'Select the Probation region', value: 'North East' },
      ])
      page.probationDeliveryUnitSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Organisation's Probation Delivery Unit (PDU)", value: 'Sunderland' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Prison',
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the Youth Justice Service region',
      ])
    })

    context('With DDv5 disabled', () => {
      const disabledFlags = { DD_V5_1_ENABLED: false }

      beforeEach(() => {
        cy.task('setFeatureFlags', disabledFlags)
      })

      afterEach(() => {
        cy.task('resetFeatureFlags')
      })

      it('Should show probation delivery unit', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'HOME_OFFICE',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.probationDeliveryUnitSection.shouldNotExist()
      })
    })

    context('With DDv5 enabled', () => {
      const enabledFlags = { DD_V5_1_ENABLED: true }

      beforeEach(() => {
        cy.task('setFeatureFlags', enabledFlags)
      })

      afterEach(() => {
        cy.task('resetFeatureFlags')
      })

      it('Should show the civil & county court name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'CIVIL_COUNTY_COURT',
              notifyingOrganisationName: 'YEOVIL_COUNTY_AND_CIVIL_COURT',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Civil & County Court' },
          { key: 'Select the name of the Civil and County Court', value: 'Yeovil County and Civil Court' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          // 'Select the name of the Civil and County Court',
          'Select the name of the Prison',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the name of the Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the crown court name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'CROWN_COURT',
              notifyingOrganisationName: 'BRISTOL_CROWN_COURT',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Crown Court' },
          { key: 'Select the name of the Crown Court', value: 'Bristol Crown Court' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Family Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the family court name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'FAMILY_COURT',
              notifyingOrganisationName: 'CAERNARFON_FAMILY_COURT',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Family Court' },
          { key: 'Select the name of the Family Court', value: 'Caernarfon Family Court' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the military court name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'MILITARY_COURT',
              notifyingOrganisationName: 'CATTERICK_MILITARY_COURT_CENTRE',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Military Court' },
          { key: 'Select the name of the Military Court', value: 'Catterick Military Court Centre' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the notifying organisation probation service region', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'PROBATION',
              notifyingOrganisationName: 'YORKSHIRE_AND_THE_HUMBER',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Probation Service' },
          { key: 'Select the Probation Service region', value: 'Yorkshire and the Humber' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the name of the Military Court',
          'Select the name of the Prison',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the prison name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'STOCKEN_PRISON',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Prison Service' },
          { key: 'Select the name of the Prison', value: 'Stocken Prison' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the YCS region',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the youth custody service (YCS) region', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
              notifyingOrganisationName: 'MIDLANDS',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Youth Custody Service (YCS)' },
          { key: 'Select the YCS region', value: 'Midlands' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the name of the Youth Court',
        ])
      })

      it('Should show the youth court name', () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            contactDetails: {
              contactNumber: '01234567890',
            },
            deviceWearer: {
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'YOUTH_COURT',
              notifyingOrganisationName: 'PENZANCE_YOUTH_COURT',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
            probationDeliverUnit: {
              unit: 'Sunderland',
            },
          },
        })
        const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

        page.organisationDetailsSection.shouldExist()
        page.organisationDetailsSection.shouldHaveItems([
          { key: 'What organisation or related organisation are you part of?', value: 'Youth Court' },
          { key: 'Select the name of the Youth Court', value: 'Penzance Youth Court' },
        ])
        page.deviceWearerAddressesSection.shouldNotHaveItems([
          'Select the name of the Civil and County Court',
          'Select the name of the Crown Court',
          'Select the name of the Family Court',
          'Select the name of the Military Court',
          'Select the Probation Service region',
          'Select the name of the Prison',
          'Select the YCS region',
        ])
      })
    })

    it('should show YJS region', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'YJS',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'YORKSHIRE_AND_HUMBERSIDE',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: "What is the Responsible Officer's organisation?", value: 'Youth Justice Service (YJS)' },
        { key: 'Select the Youth Justice Service region', value: 'Yorkshire and Humberside' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Prison',
        'Select the name of the Crown Court',
        'Select the name of the Court',
      ])
    })
  })

  context('Device Wearer has fixed address', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    const pageHeading = 'Check your answers'

    it('should show main address section', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
          ],
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'Yes' },
        { key: "What is the device wearer's main address?", value: '10 downing street, , SW1A 2AA' },
      ])

      page.deviceWearerAddressesSection.shouldNotHaveItems([
        "What is the device wearer's second address?",
        "What is the device wearer's third address?",
      ])
      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])
    })

    it('should show all addresses section', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
            {
              addressType: 'SECONDARY',
              addressLine1: '3 Kelvin Close',
              addressLine2: 'Birchwood',
              addressLine3: 'Warrington',
              addressLine4: 'ENGLAND',
              postcode: 'WA3 7PB',
            },
            {
              addressType: 'TERTIARY',
              addressLine1: '2 Dunlin Close',
              addressLine2: 'Bolton',
              addressLine3: 'Greater Manchester',
              addressLine4: 'ENGLAND',
              postcode: 'BL2 1EW',
            },
          ],
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'Yes' },
        { key: "What is the device wearer's main address?", value: '10 downing street, , SW1A 2AA' },
        { key: "What is the device wearer's second address?", value: '3 Kelvin Close, Birchwood, WA3 7PB' },
        { key: "What is the device wearer's third address?", value: '2 Dunlin Close, Bolton, BL2 1EW' },
      ])

      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])
    })
  })

  context('Application has been submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'You are viewing a submitted form. This form was submitted on the 14 December 2024.',
      )
    })

    it('shows contact information caption', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('displays the correct answers for checking', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'No' },
      ])

      page.deviceWearerAddressesSection.shouldNotHaveItems([
        "What is the device wearer's main address?",
        "What is the device wearer's second address?",
        "What is the device wearer's third address?",
      ])
      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])
    })
    it('does not show "change" links', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })

  context('Application failed to submit', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          contactDetails: {
            contactNumber: '01234567890',
          },
          deviceWearer: {
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: '',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        },
      })
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'This form failed to submit. This was due to a technical problem. For more information ',
      )
      page.submittedBanner.contains('a', 'view the guidance (opens in a new tab)')
    })

    it('shows contact information caption', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('displays the correct answers for checking', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.contactDetailsSection.shouldExist()
      page.contactDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's telephone number? (optional)", value: '01234567890' },
      ])

      page.deviceWearerAddressesSection.shouldExist()
      page.deviceWearerAddressesSection.shouldHaveItems([
        { key: 'Does the device wearer have a fixed address?', value: 'No' },
      ])

      page.deviceWearerAddressesSection.shouldNotHaveItems([
        "What is the device wearer's main address?",
        "What is the device wearer's second address?",
        "What is the device wearer's third address?",
      ])
      page.organisationDetailsSection.shouldExist()
      page.organisationDetailsSection.shouldHaveItems([
        { key: 'What organisation or related organisation are you part of?', value: 'Home Office' },
        { key: "What is your team's contact email address?", value: 'notifying@organisation' },
        { key: "What is the Responsible Officer's full name?", value: 'name' },
        { key: "What is the Responsible Officer's telephone number?", value: '01234567891' },
        { key: "What is the Responsible Officer's organisation?", value: 'Police' },
        { key: "What is the Responsible Organisation's email address? (optional)", value: 'responsible@organisation' },
      ])
      page.deviceWearerAddressesSection.shouldNotHaveItems([
        'Select the name of the Crown Court',
        'Select the name of the Court',
        'Select the name of the Prison',
        'Select the Probation region',
        'Select the Youth Justice Service region',
      ])
    })
    it('does not show "change" links', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(ContactInformationCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
