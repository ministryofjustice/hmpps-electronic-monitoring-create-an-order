import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../pages/order/summary'
import Page from '../../pages/page'
import AttachmentType from '../../../server/models/AttachmentType'
import paths from '../../../server/constants/paths'
import versionInformation from './summary-helpers'

const mockOrderId = uuidv4()

context('Order Summary', () => {
  context('viewing an old version of the order', () => {
    const versionOneId = uuidv4()
    const versionTwoId = uuidv4()

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetVersion', {
        httpStatus: 200,
        id: mockOrderId,
        versionId: versionOneId,
        order: {
          id: mockOrderId,
          status: 'SUBMITTED',
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
            firstName: 'Joe',
            lastName: 'Bloggs',
            alias: null,
            dateOfBirth: null,
            adultAtTimeOfInstallation: false,
            sex: null,
            gender: null,
            disabilities: '',
            noFixedAbode: false,
            interpreterRequired: null,
          },
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            genderRiskDetails: null,
            offence: null,
            offenceAdditionalDetails: null,
          },
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            responsibleOrganisationEmail: '',
            responsibleOrganisationPhoneNumber: '',
            responsibleOrganisationRegion: '',
          },
          offences: [
            {
              id: 'offence id',
              offenceType: 'SEXUAL_OFFENCES',
            },
          ],
          offenceAdditionalDetails: {
            additionalDetails: 'mock offence details',
          },
          detailsOfInstallation: {
            riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
            riskDetails: 'some risk details',
            genderRiskDetails: '',
          },
          mappa: { isMappa: 'NO' },
          enforcementZoneConditions: [
            {
              description: null,
              duration: null,
              endDate: null,
              fileId: null,
              fileName: null,
              startDate: null,
              zoneId: null,
              zoneType: null,
            },
          ],
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'SECONDARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'TERTIARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'INSTALLATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
          ],
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
          monitoringConditions: {
            orderType: null,
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
            pilot: null,
            isValid: true,
            offenceType: null,
          },
          monitoringConditionsTrail: { startDate: null, endDate: null },
          monitoringConditionsAlcohol: {
            endDate: null,
            installationLocation: null,
            monitoringType: null,
            prisonName: null,
            probationOfficeName: null,
            startDate: null,
          },
          isValid: true,
          mandatoryAttendanceConditions: [
            {
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              appointmentDay: null,
              endDate: null,
              endTime: null,
              postcode: null,
              purpose: null,
              startDate: null,
              startTime: null,
            },
          ],
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
          installationLocation: {
            location: 'PRIMARY',
          },
          installationAppointment: { placeName: 'blah', appointmentDate: new Date() },
        },
      })

      const versionOne = versionInformation({
        submittedBy: 'Person One',
        versionId: versionOneId,
        fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
      })
      const versionTwo = versionInformation({
        submittedBy: 'Person Two',
        versionId: versionTwoId,
        type: 'VARIATION',
        fmsResultDate: new Date(2025, 0, 3, 10, 30, 0, 0).toISOString(),
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [versionTwo, versionOne],
        orderId: mockOrderId,
      })

      cy.signIn()
    })

    const convertToExpectedPath = (path: string) => {
      return path.replace(':orderId', mockOrderId).replace(':versionId', versionOneId)
    }

    it('has correct section links', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId, versionId: versionOneId }, {}, true)

      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.additionalDocumentsTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.ATTACHMENT.BASE_URL_VERSION),
      )
    })

    it('content is correct', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId, versionId: versionOneId }, {}, true)

      page.makeChangesButton.should('not.exist')
      page.viewAndDownloadButton.should('have.attr', 'href', convertToExpectedPath(paths.ORDER.RECEIPT_VERSION))

      cy.get('.govuk-label-s').contains(
        "You can't make changes to this form because there are more recent versions of it.",
      )
    })
  })
})
