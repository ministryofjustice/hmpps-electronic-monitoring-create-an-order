import { v4 as uuidv4 } from 'uuid'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../mockApis/faker'

import Page from '../pages/page'
import IndexPage from '../pages/index'
import OrderSummaryPage from '../pages/order/summary'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber } from './utils'

context('The kitchen sink', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    map: {
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

    cy.task('stubFmsUploadAttachment', {
      httpStatus: 200,
      fileName: files.map.fileName,
      deviceWearerId: fmsCaseId,
      response: {
        status: 200,
        result: {},
      },
    })

    cy.task('stubUploadDocument', {
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.map.fileName,
        filename: files.map.fileName,
        fileExtension: files.map.fileName.split('.')[1],
        mimeType: 'application/pdf',
      },
    })

    cy.readFile(files.map.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        id: '(.*)',
        httpStatus: 200,
        contextType: 'image/pdf',
        fileBase64Body: content,
      })
    })
  })

  context('Fill in everything ', () => {
    const currenDate = new Date()
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
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
    const monitoringConditions = {
      startDate: new Date(currenDate.getFullYear(), 0, 1, 11, 11),
      endDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59),
      isPartOfACP: 'No',
      isPartOfDAPOL: 'No',
      orderType: 'Post Release',
      pilot: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
      conditionType: 'Bail Order',
      monitoringRequired: ['Curfew', 'Exclusion zone monitoring', 'Trail monitoring'],
    }
    const curfewReleaseDetails = {
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: { hours: '19', minutes: '00' },
      endTime: { hours: '07', minutes: '00' },
      address: /Main address/,
    }
    const curfewConditionDetails = {
      startDate: new Date(currenDate.getFullYear(), 0, 1, 0, 0, 0),
      endDate: new Date(currenDate.getFullYear() + 1, 0, 1, 23, 59, 0),
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
      startDate: new Date(currenDate.getFullYear(), 4, 1),
      endDate: new Date(currenDate.getFullYear() + 1, 4, 1, 23, 59, 0),
      uploadFile: files.map,
      description: 'A test description: Lorum ipsum dolar sit amet...',
      duration: 'A test duration: one, two, three...',
      anotherZone: 'No',
    }
    const trailMonitoringOrder = {
      startDate: new Date(currenDate.getFullYear(), 11, 1),
      endDate: new Date(currenDate.getFullYear() + 1, 11, 1, 23, 59, 0),
    }
    const probationDeliveryUnit = {
      unit: 'Blackburn',
    }

    const installationAndRisk = {
      possibleRisk: 'Sex offender',
      riskCategory: 'Children under the age of 18 are living at the property',
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
        monitoringConditions,
        installationAddressDetails,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        enforcementZoneDetails: primaryEnforcementZoneDetails,
        alcoholMonitoringDetails: undefined,
        trailMonitoringDetails: trailMonitoringOrder,
        files: undefined,
        probationDeliveryUnit,
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
          address_1: primaryAddressDetails.line1,
          address_2: primaryAddressDetails.line2 === '' ? 'N/A' : primaryAddressDetails.line2,
          address_3: primaryAddressDetails.line3,
          address_4: primaryAddressDetails.line4 === '' ? 'N/A' : primaryAddressDetails.line4,
          address_post_code: primaryAddressDetails.postcode,
          secondary_address_1: '',
          secondary_address_2: '',
          secondary_address_3: '',
          secondary_address_4: '',
          secondary_address_post_code: '',
          phone_number: formatAsFmsPhoneNumber(deviceWearerDetails.contactNumber),
          risk_serious_harm: '',
          risk_self_harm: '',
          risk_details: '',
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
          home_office_case_reference_number: deviceWearerDetails.homeOfficeReferenceNumber,
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
            condition_type: monitoringConditions.conditionType,
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
                start_date: formatAsFmsDateTime(monitoringConditions.startDate, 0, 0),
                end_date: formatAsFmsDateTime(monitoringConditions.endDate, 23, 59),
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
            no_email: '',
            no_name: interestedParties.notifyingOrganisationName,
            no_phone_number: '',
            offence: '',
            offence_date: '',
            order_end: formatAsFmsDateTime(monitoringConditions.endDate),
            order_id: orderId,
            order_request_type: 'New Order',
            order_start: formatAsFmsDateTime(monitoringConditions.startDate),
            order_type: monitoringConditions.orderType,
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
            ro_email: 'probation@example.com',
            ro_phone: '',
            ro_region: interestedParties.responsibleOrganisationRegion,
            sentence_date: '',
            sentence_expiry: '',
            sentence_type: '',
            tag_at_source: '',
            tag_at_source_details: '',
            technical_bail: '',
            trial_date: '',
            trial_outcome: '',
            conditional_release_date: formatAsFmsDate(curfewReleaseDetails.releaseDate),
            reason_for_order_ending_early: '',
            business_unit: '',
            service_end_date: formatAsFmsDate(monitoringConditions.endDate),
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
            installation_address_1: installationAddressDetails.line1,
            installation_address_2: installationAddressDetails.line2,
            installation_address_3: installationAddressDetails.line3 ?? '',
            installation_address_4: installationAddressDetails.line4 ?? '',
            installation_address_post_code: installationAddressDetails.postcode,
            crown_court_case_reference_number: '',
            magistrate_court_case_reference_number: '',
            issp: 'No',
            hdc: 'No',
            order_status: 'Not Started',
          },
        }).should('be.true')
      })
    })
  })
})
