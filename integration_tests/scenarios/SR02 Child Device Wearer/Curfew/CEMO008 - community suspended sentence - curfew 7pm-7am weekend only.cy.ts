import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import {
  createFakeYouthDeviceWearer,
  createFakeInterestedParties,
  createFakeResponsibleAdult,
  createFakeAddress,
} from '../../../mockApis/faker'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import { formatAsFmsDateTime } from '../../utils'

context('Scenarios', () => {
  const fmsCaseId: string = uuidv4()
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
  })

  context('Suspended Sentence Orders (Community) with Radio Frequency (RF) (HMU + PID) Weekend Only 7pm-7am.', () => {
    const deviceWearerDetails = {
      ...createFakeYouthDeviceWearer(),
      interpreterRequired: false,
      hasFixedAddress: 'Yes',
    }
    const responsibleAdultDetails = createFakeResponsibleAdult()
    const fakePrimaryAddress = createFakeAddress()
    const interestedParties = createFakeInterestedParties('Probation', 'Probation')
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      orderType: 'Community',
      orderTypeDescription: 'GPS Acquisitive Crime Parole',
      conditionType: 'Requirement of a Community Order',
      monitoringRequired: 'Curfew',
    }
    const curfewReleaseDetails = {
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: { hours: '19', minutes: '00' },
      endTime: { hours: '07', minutes: '00' },
      address: /Main address/,
    }
    const curfewConditionDetails = {
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
      endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
      addresses: [/Main address/],
    }
    const curfewNights = ['FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.fillInNewCurfewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails,
        primaryAddressDetails: fakePrimaryAddress,
        secondaryAddressDetails: undefined,
        interestedParties,
        installationAndRisk: undefined,
        monitoringConditions,
        installationAddressDetails: fakePrimaryAddress,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        files: undefined,
      })
      orderSummaryPage.submitOrderButton.click()

      cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
        responseRecordFilename: 'CEMO008',
        httpStatus: 200,
        body: {
          title: '',
          first_name: deviceWearerDetails.firstNames,
          middle_name: '',
          last_name: deviceWearerDetails.lastName,
          alias: deviceWearerDetails.alias,
          date_of_birth: deviceWearerDetails.dob.toISOString().split('T')[0],
          adult_child: 'child',
          sex: deviceWearerDetails.sex.toLocaleLowerCase().replace('not able to provide this information', 'unknown'),
          gender_identity: deviceWearerDetails.genderIdentity
            .toLocaleLowerCase()
            .replace('not able to provide this information', 'unknown')
            .replace('self identify', 'self-identify')
            .replace('non binary', 'non-binary'),
          disability: [],
          address_1: fakePrimaryAddress.line1,
          address_2: 'N/A',
          address_3: fakePrimaryAddress.line3,
          address_4: fakePrimaryAddress.line4,
          address_post_code: fakePrimaryAddress.postcode,
          secondary_address_1: '',
          secondary_address_2: '',
          secondary_address_3: '',
          secondary_address_4: '',
          secondary_address_post_code: '',
          phone_number: deviceWearerDetails.contactNumber,
          risk_serious_harm: '',
          risk_self_harm: '',
          risk_details: '',
          mappa: null,
          mappa_case_type: null,
          risk_categories: [],
          responsible_adult_required: 'true',
          parent: responsibleAdultDetails.fullName,
          guardian: '',
          parent_address_1: '',
          parent_address_2: '',
          parent_address_3: '',
          parent_address_4: '',
          parent_address_post_code: '',
          parent_phone_number: responsibleAdultDetails.contactNumber,
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
          .task('verifyFMSCreateMonitoringOrderRequestReceived', {
            responseRecordFilename: 'CEMO008',
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
                  start_date: formatAsFmsDateTime(curfewConditionDetails.startDate),
                  end_date: formatAsFmsDateTime(curfewConditionDetails.endDate),
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
              order_type_description: monitoringConditions.orderTypeDescription,
              order_type_detail: '',
              order_variation_date: '',
              order_variation_details: '',
              order_variation_req_received_date: '',
              order_variation_type: '',
              pdu_responsible: '',
              pdu_responsible_email: '',
              planned_order_end_date: '',
              responsible_officer_details_received: '',
              responsible_officer_email: '',
              responsible_officer_phone: interestedParties.responsibleOfficerContactNumber,
              responsible_officer_name: interestedParties.responsibleOfficerName,
              responsible_organization: interestedParties.responsibleOrganisation,
              ro_post_code: interestedParties.responsibleOrganisationAddress.postcode,
              ro_address_1: interestedParties.responsibleOrganisationAddress.line1,
              ro_address_2: interestedParties.responsibleOrganisationAddress.line2,
              ro_address_3: interestedParties.responsibleOrganisationAddress.line3,
              ro_address_4: interestedParties.responsibleOrganisationAddress.line4,
              ro_email: interestedParties.responsibleOrganisationEmailAddress,
              ro_phone: interestedParties.responsibleOrganisationContactNumber,
              ro_region: interestedParties.responsibleOrganisationRegion,
              sentence_date: '',
              sentence_expiry: '',
              sentence_type: '',
              tag_at_source: '',
              tag_at_source_details: '',
              technical_bail: '',
              trial_date: '',
              trial_outcome: '',
              conditional_release_date: curfewReleaseDetails.releaseDate.toISOString().split('T')[0],
              reason_for_order_ending_early: '',
              business_unit: '',
              service_end_date: monitoringConditions.endDate.toISOString().split('T')[0],
              curfew_description: '',
              curfew_start: formatAsFmsDateTime(curfewConditionDetails.startDate),
              curfew_end: formatAsFmsDateTime(curfewConditionDetails.endDate),
              curfew_duration: [
                {
                  location: 'primary',
                  allday: '',
                  schedule: [
                    {
                      day: 'Fr',
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Sa',
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Su',
                      start: '19:00:00',
                      end: '07:00:00',
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
              installation_address_1: fakePrimaryAddress.line1,
              installation_address_2: fakePrimaryAddress.line2,
              installation_address_3: fakePrimaryAddress.line3 ?? '',
              installation_address_4: fakePrimaryAddress.line4 ?? '',
              installation_address_post_code: fakePrimaryAddress.postcode,
              crown_court_case_reference_number: '',
              magistrate_court_case_reference_number: '',
              issp: 'No',
              hdc: 'No',
              order_status: 'Not Started',
            },
          })
          .should('be.true')
      })

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
    })
  })
})
