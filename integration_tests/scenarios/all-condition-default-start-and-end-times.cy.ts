import { v4 as uuidv4 } from 'uuid'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber, stubAttachments } from './utils'

context('The kitchen sink', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }
  let orderId: string

  const cacheOrderId = () => {
    cy.url().then((url: string) => {
      const parts = url.replace(Cypress.config().baseUrl, '').split('/')
      ;[, , orderId] = parts
    })
  }
  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    stubAttachments(files, fmsCaseId, hmppsDocumentId)
  })

  context('Fill in everything ', () => {
    const currentDate = new Date()
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
      disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
      otherDisability: null,
      interpreterRequired: false,
      language: '',
      hasFixedAddress: 'Yes',
    }
    const primaryAddressDetails = {
      ...createFakeAddress(),
      hasAnotherAddress: 'No',
    }
    const installationAddressDetails = createFakeAddress()
    const interestedParties = createFakeInterestedParties('Prison', 'Probation', null, 'North West')

    const monitoringOrderTypeDescription = {
      sentenceType: 'Standard Determinate Sentence',
      hdc: 'Yes',
      prarr: 'Yes',
      pilot: 'GPS acquisitive crime (EMAC)',
      typeOfAcquistiveCrime: 'Burglary in a Dwelling - Indictable only',
      policeForceArea: 'Avon and Somerset',
      monitoringCondition: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring'],
    }
    const curfewReleaseDetails = {
      startTime: { hours: '19', minutes: '00' },
      endTime: { hours: '07', minutes: '00' },
      address: /Main address/,
    }
    const curfewConditionDetails = {
      startDate: new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0),
      endDate: new Date(currentDate.getFullYear() + 1, 0, 1, 23, 59, 0),
      addresses: [/Main address/],
    }
    const curfewNights = ['MONDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '00:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
      {
        day,
        startTime: '19:00:00',
        endTime: '11:59:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])
    const primaryEnforcementZoneDetails = {
      zoneType: 'Exclusion zone',
      startDate: new Date(currentDate.getFullYear(), 4, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 4, 1, 23, 59, 0),
      uploadFile: files.licence,
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
    }
    const trailMonitoringOrder = {
      startDate: new Date(currentDate.getFullYear(), 11, 1),
      endDate: new Date(currentDate.getFullYear() + 1, 11, 1, 23, 59, 0),
    }
    const probationDeliveryUnit = {
      unit: 'Blackburn',
    }

    const installationAndRisk = {
      offence: 'Sexual offences',
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
      riskDetails: 'No risk',
    }

    const attachmentFiles = {
      licence: { fileName: files.licence.fileName, contents: files.licence.contents },
    }

    it('With default start time and end time, british time is send to FMS', () => {
      cy.signIn()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.fillInNewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails: undefined,
        primaryAddressDetails,
        secondaryAddressDetails: undefined,
        interestedParties,
        installationAndRisk,
        monitoringOrderTypeDescription,
        installationAddressDetails,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        enforcementZoneDetails: primaryEnforcementZoneDetails,
        alcoholMonitoringDetails: undefined,
        trailMonitoringDetails: trailMonitoringOrder,
        attendanceMonitoringDetails: undefined,
        files: attachmentFiles,
        probationDeliveryUnit,
        installationLocation: undefined,
        installationAppointment: undefined,
      })
      orderSummaryPage.submitOrderButton.click()
      cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
        responseRecordFilename: 'DefaultTime',
        httpStatus: 200,
        body: {
          title: '',
          first_name: deviceWearerDetails.firstNames,
          middle_name: '',
          last_name: deviceWearerDetails.lastName,
          alias: deviceWearerDetails.alias,
          date_of_birth: formatAsFmsDate(deviceWearerDetails.dob),
          adult_child: 'adult',
          sex: deviceWearerDetails.sex
            .replace('Not able to provide this information', 'Prefer Not to Say')
            .replace('Prefer not to say', 'Prefer Not to Say'),
          gender_identity: deviceWearerDetails.genderIdentity
            .replace('Not able to provide this information', '')
            .replace('Self identify', 'Prefer to self-describe')
            .replace('Non binary', 'Non-Binary'),
          disability: [],
          address_1: primaryAddressDetails.addressLine1,
          address_2: primaryAddressDetails.addressLine2 === '' ? 'N/A' : primaryAddressDetails.addressLine2,
          address_3: primaryAddressDetails.addressLine3,
          address_4: primaryAddressDetails.addressLine4 === '' ? 'N/A' : primaryAddressDetails.addressLine4,
          address_post_code: primaryAddressDetails.postcode,
          secondary_address_1: '',
          secondary_address_2: '',
          secondary_address_3: '',
          secondary_address_4: '',
          secondary_address_post_code: '',
          tertiary_address_1: '',
          tertiary_address_2: '',
          tertiary_address_3: '',
          tertiary_address_4: '',
          tertiary_address_post_code: '',
          phone_number: formatAsFmsPhoneNumber(deviceWearerDetails.contactNumber),
          risk_serious_harm: '',
          risk_self_harm: '',
          risk_details: 'No risk',
          mappa: null,
          mappa_case_type: null,
          risk_categories: [
            {
              category: 'Sexual Offences',
            },
            {
              category: 'Under 18 living at property',
            },
          ],
          responsible_adult_required: 'false',
          parent: '',
          guardian: '',
          parent_address_1: '',
          parent_address_2: '',
          parent_address_3: '',
          parent_address_4: '',
          parent_address_post_code: '',
          parent_phone_number: null,
          parent_dob: '',
          pnc_id: deviceWearerDetails.pncId,
          nomis_id: deviceWearerDetails.nomisId,
          delius_id: deviceWearerDetails.deliusId,
          prison_number: deviceWearerDetails.prisonNumber,
          home_office_case_reference_number: '',
          complianceAndEnforcementPersonReference: deviceWearerDetails.complianceAndEnforcementPersonReference,
          courtCaseReferenceNumber: deviceWearerDetails.courtCaseReferenceNumber,
          interpreter_required: 'false',
          language: '',
        },
      }).should('be.true')

      cy.wrap(orderId).then(() => {
        cy.task('verifyFMSCreateMonitoringOrderRequestReceived', {
          responseRecordFilename: 'DefaultTime',
          httpStatus: 200,
          body: {
            case_id: fmsCaseId,
            allday_lockdown: '',
            atv_allowance: '',
            condition_type: 'License Condition of a Custodial Order',
            court: '',
            court_order_email: '',
            device_type: '',
            device_wearer: deviceWearerDetails.fullName,
            enforceable_condition: [
              {
                condition: 'Curfew with EM',
                start_date: formatAsFmsDateTime(curfewConditionDetails.startDate, 0, 0),
                end_date: formatAsFmsDateTime(curfewConditionDetails.endDate, 23, 59),
              },
              {
                condition: 'Location Monitoring (Fitted Device)',
                start_date: formatAsFmsDateTime(trailMonitoringOrder.startDate, 0, 0),
                end_date: formatAsFmsDateTime(trailMonitoringOrder.endDate, 23, 59),
              },
              {
                condition: 'EM Exclusion / Inclusion Zone',
                start_date: formatAsFmsDateTime(curfewConditionDetails.startDate, 0, 0),
                end_date: formatAsFmsDateTime(trailMonitoringOrder.endDate, 23, 59),
              },
            ],
            exclusion_allday: '',
            interim_court_date: '',
            issuing_organisation: '',
            media_interest: '',
            new_order_received: '',
            notifying_officer_email: '',
            notifying_officer_name: '',
            notifying_organization: interestedParties.notifyingOrganisation,
            no_post_code: '',
            no_address_1: '',
            no_address_2: '',
            no_address_3: '',
            no_address_4: '',
            no_email: interestedParties.notifyingOrganisationEmailAddress,
            no_name: interestedParties.notifyingOrganisationName,
            no_phone_number: '',
            offence: installationAndRisk.offence,
            offence_additional_details: 'AC Offence: Burglary in a Dwelling - Indictable only. PFA: Avon and Somerset',
            offence_date: '',
            order_end: formatAsFmsDateTime(trailMonitoringOrder.endDate, 23, 59),
            order_id: orderId,
            order_request_type: 'New Order',
            order_start: formatAsFmsDateTime(curfewConditionDetails.startDate, 0, 0),
            order_type: 'Post Release',
            order_type_description: null,
            order_type_detail: '',
            order_variation_date: '',
            order_variation_details: '',
            order_variation_req_received_date: '',
            order_variation_type: '',
            pdu_responsible: 'Blackburn',
            pdu_responsible_email: '',
            planned_order_end_date: '',
            responsible_officer_details_received: '',
            responsible_officer_email: '',
            responsible_officer_phone: formatAsFmsPhoneNumber(interestedParties.responsibleOfficerContactNumber),
            responsible_officer_name: interestedParties.responsibleOfficerName,
            responsible_organization: interestedParties.responsibleOrganisation,
            ro_post_code: '',
            ro_address_1: '',
            ro_address_2: '',
            ro_address_3: '',
            ro_address_4: '',
            ro_email: interestedParties.responsibleOrganisationEmailAddress,
            ro_phone: '',
            ro_region: interestedParties.responsibleOrganisationRegion,
            sentence_date: '',
            sentence_expiry: '',
            sentence_type: 'Standard Determinate Sentence',
            tag_at_source: '',
            tag_at_source_details: '',
            date_and_time_installation_will_take_place: '',
            released_under_prarr: 'true',
            technical_bail: '',
            trial_date: '',
            trial_outcome: '',
            conditional_release_date: formatAsFmsDate(curfewConditionDetails.startDate),
            conditional_release_start_time: '19:00:00',
            conditional_release_end_time: '07:00:00',
            reason_for_order_ending_early: '',
            business_unit: '',
            service_end_date: formatAsFmsDate(trailMonitoringOrder.endDate),
            curfew_description: '',
            curfew_start: formatAsFmsDateTime(curfewConditionDetails.startDate, 0, 0),
            curfew_end: formatAsFmsDateTime(curfewConditionDetails.endDate, 23, 59),
            curfew_duration: [
              {
                location: 'primary',
                allday: '',
                schedule: [
                  {
                    day: 'Mo',
                    start: '00:00:00',
                    end: '07:00:00',
                  },
                  {
                    day: 'Mo',
                    start: '19:00:00',
                    end: '11:59:00',
                  },
                ],
              },
            ],
            trail_monitoring: 'No',
            exclusion_zones: [
              {
                description: primaryEnforcementZoneDetails.description,
                duration: primaryEnforcementZoneDetails.duration,
                start: formatAsFmsDate(primaryEnforcementZoneDetails.startDate),
                end: formatAsFmsDate(primaryEnforcementZoneDetails.endDate),
              },
            ],
            inclusion_zones: [],
            abstinence: '',
            schedule: '',
            checkin_schedule: [],
            revocation_date: '',
            revocation_type: '',
            installation_address_1: '',
            installation_address_2: '',
            installation_address_3: '',
            installation_address_4: '',
            installation_address_post_code: '',
            crown_court_case_reference_number: '',
            magistrate_court_case_reference_number: '',
            issp: 'No',
            hdc: 'Yes',
            order_status: 'Not Started',
            pilot: 'GPS Acquisitive Crime Home Detention Curfew',
            subcategory: '',
            dapol_missed_in_error: '',
          },
        }).should('be.true')
      })
    })
  })
})
