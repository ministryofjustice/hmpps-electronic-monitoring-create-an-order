import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createKnownAddress } from '../../../mockApis/faker'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import VariationSubmitSuccessPage from '../../../pages/order/variation-submit-success'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber, stubAttachments } from '../../utils'

context('Scenarios', () => {
  const fmsCaseId: string = uuidv4()
  let orderId: string
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }

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

    cy.task('stubFMSUpdateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSUpdateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)
  })

  context(
    'Pre-Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-3am -  - Variation of additional address',
    () => {
      const deviceWearerDetails = {
        ...createFakeAdultDeviceWearer('CEMO020'),
        interpreterRequired: false,
        hasFixedAddress: 'Yes',
      }
      const fakePrimaryAddress = createKnownAddress()
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'North West')
      const probationDeliveryUnit = { unit: 'Blackburn' }
      const monitoringConditions = {
        startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
        endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
        orderType: 'Pre-Trial',
        conditionType: 'Licence condition',
        monitoringRequired: 'Curfew',
        hdc: 'Yes',
        sentenceType: 'Life Sentence',
        pilot: 'They are not part of any of these pilots',
      }
      const curfewReleaseDetails = {
        releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
        startTime: { hours: '19', minutes: '00' },
        endTime: { hours: '03', minutes: '00' },
        address: /Main address/,
      }
      const curfewConditionDetails = {
        startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
        endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
        addresses: [/Main address/],
      }
      const curfewNights = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      const curfewTimetable = curfewNights.flatMap((day: string) => [
        {
          day,
          startTime: '19:00:00',
          endTime: '03:00:00',
          addresses: curfewConditionDetails.addresses,
        },
      ])

      const variationDetails = {
        variationType: 'The device wearer’s address',
        variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
        variationDetails: 'Change to address',
      }
      let fakeVariationSecondaryAddress = createKnownAddress()
      while (fakeVariationSecondaryAddress.postcode === fakePrimaryAddress.postcode) {
        fakeVariationSecondaryAddress = createKnownAddress()
      }
      const variationCurfewConditionDetails = {
        startDate: variationDetails.variationDate,
        endDate: curfewConditionDetails.endDate,
        addresses: [/Main address/, /Second address/],
      }
      const variationCurfewTimetable = curfewNights.flatMap((day: string) => [
        {
          day,
          startTime: '19:00:00',
          endTime: '03:00:00',
          addresses: variationCurfewConditionDetails.addresses,
        },
      ])

      const installationAndRisk = {
        possibleRisk: 'There are no risks that the installer should be aware of',
        riskDetails: 'No risk',
      }

      it('Should successfully submit the order to the FMS API', () => {
        cy.signIn()

        let indexPage = Page.verifyOnPage(IndexPage)
        indexPage.newOrderFormButton.click()

        let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
        cacheOrderId()
        orderSummaryPage.fillInNewCurfewOrderWith({
          deviceWearerDetails,
          responsibleAdultDetails: undefined,
          primaryAddressDetails: fakePrimaryAddress,
          secondaryAddressDetails: undefined,
          interestedParties,
          installationAndRisk,
          monitoringConditions,
          curfewReleaseDetails,
          curfewConditionDetails,
          curfewTimetable,
          files,
          probationDeliveryUnit,
        })
        orderSummaryPage.submitOrderButton.click()

        const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
        submitSuccessPage.backToYourApplications.click()

        indexPage = Page.verifyOnPage(IndexPage)
        indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
        indexPage.newVariationFormButton.click()

        orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
        cacheOrderId()
        orderSummaryPage = orderSummaryPage.fillInCurfewVariationWith({
          variationDetails,
          deviceWearerDetails,
          responsibleAdultDetails: undefined,
          primaryAddressDetails: fakePrimaryAddress,
          secondaryAddressDetails: fakeVariationSecondaryAddress,
          interestedParties,
          installationAndRisk,
          monitoringConditions,
          curfewReleaseDetails,
          curfewConditionDetails: variationCurfewConditionDetails,
          curfewTimetable: variationCurfewTimetable,
          files,
          probationDeliveryUnit,
        })
        orderSummaryPage.submitOrderButton.click()

        cy.task('verifyFMSUpdateDeviceWearerRequestReceived', {
          responseRecordFilename: 'CEMO020',
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
            address_1: fakePrimaryAddress.line1,
            address_2: fakePrimaryAddress.line2 === '' ? 'N/A' : fakePrimaryAddress.line2,
            address_3: fakePrimaryAddress.line3,
            address_4: fakePrimaryAddress.line4 === '' ? 'N/A' : fakePrimaryAddress.line4,
            address_post_code: fakePrimaryAddress.postcode,
            secondary_address_1: fakeVariationSecondaryAddress.line1,
            secondary_address_2:
              fakeVariationSecondaryAddress.line2 === '' ? 'N/A' : fakeVariationSecondaryAddress.line2,
            secondary_address_3: fakeVariationSecondaryAddress.line3,
            secondary_address_4:
              fakeVariationSecondaryAddress.line4 === '' ? 'N/A' : fakeVariationSecondaryAddress.line4,
            secondary_address_post_code: fakeVariationSecondaryAddress.postcode,
            phone_number: formatAsFmsPhoneNumber(deviceWearerDetails.contactNumber),
            risk_serious_harm: '',
            risk_self_harm: '',
            risk_details: 'No risk',
            mappa: null,
            mappa_case_type: null,
            risk_categories: [],
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
          return cy
            .task('verifyFMSUpdateMonitoringOrderRequestReceived', {
              responseRecordFilename: 'CEMO020',
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
                    start_date: formatAsFmsDateTime(variationCurfewConditionDetails.startDate, 0, 0),
                    end_date: formatAsFmsDateTime(curfewConditionDetails.endDate, 23, 59),
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
                offence: '',
                offence_date: '',
                order_end: formatAsFmsDateTime(monitoringConditions.endDate),
                order_id: orderId,
                order_request_type: 'Variation',
                order_start: formatAsFmsDateTime(monitoringConditions.startDate),
                order_type: 'Pre-Trial',
                order_type_description: null,
                order_type_detail: '',
                order_variation_date: formatAsFmsDateTime(variationDetails.variationDate),
                order_variation_details: variationDetails.variationDetails,
                order_variation_req_received_date: '',
                order_variation_type: 'Change to Address',
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
                sentence_type: 'Life Sentence',
                tag_at_source: '',
                tag_at_source_details: '',
                date_and_time_installation_will_take_place: '',
                released_under_prarr: '',
                technical_bail: '',
                trial_date: '',
                trial_outcome: '',
                conditional_release_date: formatAsFmsDate(curfewReleaseDetails.releaseDate),
                reason_for_order_ending_early: '',
                business_unit: '',
                service_end_date: formatAsFmsDate(monitoringConditions.endDate),
                curfew_description: '',
                curfew_start: formatAsFmsDateTime(variationCurfewConditionDetails.startDate, 0, 0),
                curfew_end: formatAsFmsDateTime(curfewConditionDetails.endDate, 23, 59),
                curfew_duration: [
                  {
                    location: 'primary',
                    allday: '',
                    schedule: [
                      {
                        day: 'Mo',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Tu',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Wed',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Th',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Fr',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Sa',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Su',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                    ],
                  },
                  {
                    location: 'secondary',
                    allday: '',
                    schedule: [
                      {
                        day: 'Mo',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Tu',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Wed',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Th',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Fr',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Sa',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                      {
                        day: 'Su',
                        start: '19:00:00',
                        end: '03:00:00',
                      },
                    ],
                  },
                ],
                trail_monitoring: '',
                exclusion_zones: [],
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
                pilot: '',
              },
            })
            .should('be.true')
        })

        const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
        variationSubmitSuccessPage.backToYourApplications.click()

        indexPage = Page.verifyOnPage(IndexPage)
        indexPage.SubmittedVariationFor(deviceWearerDetails.fullName).should('exist')
      })
    },
  )
})
