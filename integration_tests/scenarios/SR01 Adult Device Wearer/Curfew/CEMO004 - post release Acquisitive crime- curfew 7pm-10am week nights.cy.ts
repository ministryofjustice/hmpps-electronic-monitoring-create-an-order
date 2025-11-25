import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createKnownAddress } from '../../../mockApis/faker'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber } from '../../utils'
import SearchPage from '../../../pages/search'

context('Scenarios', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
    photoId: {
      contents: 'cypress/fixtures/profile.jpeg',
      fileName: 'profile.jpeg',
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
      fileName: files.licence.fileName,
      deviceWearerId: fmsCaseId,
      response: {
        status: 200,
        result: {},
      },
    })

    cy.task('stubFmsUploadAttachment', {
      httpStatus: 200,
      fileName: files.photoId.fileName,
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
        documentFilename: files.photoId.fileName,
        filename: files.photoId.fileName,
        fileExtension: files.photoId.fileName.split('.')[1],
        mimeType: 'image/jpeg',
      },
    })

    cy.task('stubUploadDocument', {
      scenario: {
        name: 'CEMO004',
        requiredState: 'Started',
        nextState: 'second',
      },
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.licence.fileName,
        filename: files.licence.fileName,
        fileExtension: files.licence.fileName.split('.')[1],
        mimeType: 'application/pdf',
      },
    })

    cy.task('stubUploadDocument', {
      scenario: {
        name: 'CEMO004',
        requiredState: 'second',
        nextState: 'Started',
      },
      id: '(.*)',
      httpStatus: 200,
      response: {
        documentUuid: hmppsDocumentId,
        documentFilename: files.photoId.fileName,
        filename: files.photoId.fileName,
        fileExtension: files.photoId.fileName.split('.')[1],
        mimeType: 'image/jpeg',
      },
    })

    cy.readFile(files.licence.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        scenario: {
          name: 'CEMO004',
          requiredState: 'Started',
          nextState: 'second',
        },
        id: '(.*)',
        httpStatus: 200,
        contextType: 'image/pdf',
        fileBase64Body: content,
      })
    })

    cy.readFile(files.photoId.contents, 'base64').then(content => {
      cy.task('stubGetDocument', {
        scenario: {
          name: 'CEMO004',
          requiredState: 'second',
          nextState: 'Started',
        },
        id: '(.*)',
        httpStatus: 200,
        contextType: 'image/jpeg',
        fileBase64Body: content,
      })
    })
  })

  context('Pre-Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am, plus photo attachment', () => {
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer('CEMO004'),
      interpreterRequired: true,
      language: 'French',
      hasFixedAddress: 'Yes',
    }
    const fakePrimaryAddress = createKnownAddress()
    const interestedParties = createFakeInterestedParties(
      'Prison',
      'Probation',
      'Bedford Prison',
      'Kent, Surrey & Sussex',
    )

    const installationAndRisk = {
      offence: 'Robbery',
      possibleRisk: 'There are no risks that the installer should be aware of',
      riskDetails: 'No risk',
      mappaLevel: 'MAPPA 1',
      mappaCaseType: 'Serious Organised Crime',
    }

    const currentDate = new Date()

    const monitoringOrderTypeDescription = {
      monitoringStartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 10), // 10 days
      monitoringEndDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 40,
        23,
        59,
      ), // 40 days
      // orderType: 'Post Release',
      monitoringCondition: 'Curfew',
      sentenceType: 'Standard Determinate Sentence',
      pilot: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
      // issp: 'No',
      hdc: 'Yes',
      prarr: 'No',
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
    const curfewNights = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '19:00:00',
        endTime: '07:00:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])

    const probationDeliveryUnit = { unit: 'East Kent' }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()

      const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.fillInNewCurfewOrderWith({
        deviceWearerDetails,
        responsibleAdultDetails: undefined,
        primaryAddressDetails: fakePrimaryAddress,
        secondaryAddressDetails: undefined,
        interestedParties,
        installationAndRisk,
        monitoringOrderTypeDescription,
        curfewReleaseDetails,
        curfewConditionDetails,
        curfewTimetable,
        files,
        probationDeliveryUnit,
      })
      orderSummaryPage.submitOrderButton.click()

      cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
        responseRecordFilename: 'CEMO004',
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
          address_1: fakePrimaryAddress.addressLine1,
          address_2: fakePrimaryAddress.addressLine2 === '' ? 'N/A' : fakePrimaryAddress.addressLine2,
          address_3: fakePrimaryAddress.addressLine3,
          address_4: fakePrimaryAddress.addressLine4 === '' ? 'N/A' : fakePrimaryAddress.addressLine4,
          address_post_code: fakePrimaryAddress.postcode,
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
          mappa: 'MAPPA 1',
          mappa_case_type: 'SOC (Serious Organised Crime)',
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
          interpreter_required: 'true',
          language: 'French',
        },
      }).should('be.true')

      cy.wrap(orderId).then(() => {
        return cy
          .task('verifyFMSCreateMonitoringOrderRequestReceived', {
            responseRecordFilename: 'CEMO004',
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
              offence_additional_details: '',
              offence_date: '',
              order_end: formatAsFmsDateTime(monitoringOrderTypeDescription.monitoringEndDate),
              order_id: orderId,
              order_request_type: 'New Order',
              order_start: formatAsFmsDateTime(monitoringOrderTypeDescription.monitoringStartDate),
              order_type: 'Post Release',
              order_type_description: null,
              order_type_detail: '',
              order_variation_date: '',
              order_variation_details: '',
              order_variation_req_received_date: '',
              order_variation_type: '',
              pdu_responsible: 'East Kent',
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
              sentence_type: monitoringOrderTypeDescription.sentenceType,
              // sentence_type: monitoringConditions.sentenceType,
              tag_at_source: '',
              tag_at_source_details: '',
              date_and_time_installation_will_take_place: '',
              released_under_prarr: 'false',
              technical_bail: '',
              trial_date: '',
              trial_outcome: '',
              conditional_release_date: formatAsFmsDate(curfewReleaseDetails.releaseDate),
              conditional_release_start_time: '19:00:00',
              conditional_release_end_time: '07:00:00',
              reason_for_order_ending_early: '',
              business_unit: '',
              service_end_date: formatAsFmsDate(monitoringOrderTypeDescription.monitoringEndDate),
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
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Tu',
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Wed',
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Th',
                      start: '19:00:00',
                      end: '07:00:00',
                    },
                    {
                      day: 'Fr',
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
              pilot: 'Domestic Abuse Perpetrator on Licence Home Detention Curfew (DAPOL HDC)',
            },
          })
          .should('be.true')
      })

      cy.readFile(files.licence.contents, 'base64').then(contentAsBase64 => {
        cy.task('verifyFMSAttachmentRequestReceived', {
          index: 0,
          responseRecordFilename: 'CEMO004',
          httpStatus: 200,
          fileContents: contentAsBase64,
        })
      })

      cy.readFile(files.photoId.contents, 'base64').then(contentAsBase64 => {
        cy.task('verifyFMSAttachmentRequestReceived', {
          index: 1,
          responseRecordFilename: 'CEMO004',
          httpStatus: 200,
          fileContents: contentAsBase64,
        })
      })
      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      indexPage.searchNav.click()

      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.searchBox.type(deviceWearerDetails.lastName)
      searchPage.searchButton.click()
      searchPage.ordersList.contains(deviceWearerDetails.fullName)
    })
  })
})
