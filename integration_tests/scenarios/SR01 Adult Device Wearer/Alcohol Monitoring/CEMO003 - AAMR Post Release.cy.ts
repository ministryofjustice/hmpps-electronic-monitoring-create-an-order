import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
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

  context('Alcohol Abstinence and Monitoring Requirement - AAMR (Post Release)', () => {
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
      interpreterRequired: false,
      hasFixedAddress: 'Yes',
    }
    const fakePrimaryAddress = createFakeAddress()
    const interestedParties = createFakeInterestedParties()
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      orderType: 'Post Release',
      orderTypeDescription: 'DAPOL',
      conditionType: 'Bail Order',
      monitoringRequired: 'Alcohol monitoring',
    }
    const alcoholMonitoringDetails = {
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
      endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
      monitoringType: 'Alcohol abstinence',
      installLocation: `at Installation Address: ${fakePrimaryAddress}`,
    }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.fillInNewAlcoholMonitoringOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails: undefined,
        primaryAddressDetails: fakePrimaryAddress,
        secondaryAddressDetails: undefined,
        interestedParties,
        monitoringConditions,
        installationAddressDetails: fakePrimaryAddress,
        alcoholMonitoringDetails,
        files: undefined,
      })
      orderSummaryPage.submitOrderButton.click()

      cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
        responseRecordFilename: 'CEMO003',
        httpStatus: 200,
        body: {
          title: '',
          first_name: deviceWearerDetails.firstNames,
          middle_name: '',
          last_name: deviceWearerDetails.lastName,
          alias: deviceWearerDetails.alias,
          date_of_birth: deviceWearerDetails.dob.toISOString().split('T')[0],
          adult_child: 'adult',
          sex: deviceWearerDetails.sex.toLocaleLowerCase().replace("don't know", 'unknown'),
          gender_identity: deviceWearerDetails.genderIdentity
            .toLocaleLowerCase()
            .replace("don't know", 'unknown')
            .replace('self identify', 'self-identify')
            .replace('non binary', 'non-binary'),
          disability: [],
          address_1: fakePrimaryAddress.line1,
          address_2: fakePrimaryAddress.line2,
          address_3: fakePrimaryAddress.line3,
          address_4: 'N/A',
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
          responseRecordFilename: 'CEMO003',
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
                condition: 'AAMR',
                start_date: formatAsFmsDateTime(alcoholMonitoringDetails.startDate),
                end_date: formatAsFmsDateTime(alcoholMonitoringDetails.endDate),
              },
            ],
            exclusion_allday: '',
            interim_court_date: '',
            issuing_organisation: '',
            media_interest: '',
            new_order_received: '',
            notifying_officer_email: '',
            notifying_officer_name: '',
            notifying_organization: 'N/A',
            no_post_code: '',
            no_address_1: '',
            no_address_2: '',
            no_address_3: '',
            no_address_4: '',
            no_email: '',
            no_name: '',
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
            responsible_organization: interestedParties.responsibleOrganisationName
              .toUpperCase()
              .replace(/\s/g, '_')
              .replace('YOUTH_CUSTODY_SERVICE_(YCS)', 'YCS')
              .replace('YOUTH_JUSTICE_SERVICE_(YJS)', 'YJS'),
            ro_post_code: interestedParties.responsibleOrganisationAddress.postcode,
            ro_address_1: interestedParties.responsibleOrganisationAddress.line1,
            ro_address_2: interestedParties.responsibleOrganisationAddress.line2,
            ro_address_3: interestedParties.responsibleOrganisationAddress.line3,
            ro_address_4: interestedParties.responsibleOrganisationAddress.line4,
            ro_email: interestedParties.responsibleOrganisationEmailAddress,
            ro_phone: interestedParties.responsibleOrganisationContactNumber,
            ro_region: '',
            sentence_date: '',
            sentence_expiry: '',
            tag_at_source: '',
            tag_at_source_details: '',
            technical_bail: '',
            trial_date: '',
            trial_outcome: '',
            conditional_release_date: '',
            reason_for_order_ending_early: '',
            business_unit: '',
            service_end_date: monitoringConditions.endDate.toISOString().split('T')[0],
            curfew_description: '',
            curfew_start: '',
            curfew_end: '',
            curfew_duration: [],
            trail_monitoring: '',
            exclusion_zones: [],
            inclusion_zones: [],
            abstinence: 'Yes',
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
            order_status: 'Not Started',
          },
        }).should('be.true')
      })

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
    })
  })
})
