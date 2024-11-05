import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import {
  createFakeAdultDeviceWearer,
  createFakeResponsibleOfficer,
  createFakeAddress,
  createFakeOrganisation,
} from '../../../mockApis/faker'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import CurfewTimetablePage from '../../../pages/order/monitoring-conditions/curfew-timetable'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import AttachmentPage from '../../../pages/order/attachment'

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

  context('Pre-Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am, plus photo attachment', () => {
    const deviceWearerDetails = {
      ...createFakeAdultDeviceWearer(),
      interpreterRequired: false,
      hasFixedAddress: 'Yes',
    }
    const fakePrimaryAddress = createFakeAddress()
    const primaryAddressDetails = {
      ...fakePrimaryAddress,
      hasAnotherAddress: 'No',
    }
    const installationAddressDetails = fakePrimaryAddress
    const notifyingOrganisation = {
      ...createFakeOrganisation(),
      responsibleOfficer: createFakeResponsibleOfficer(),
    }
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      orderType: 'Pre-Trial',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: 'Curfew with electronic monitoring',
      devicesRequired: 'Location, not fitted',
    }
    const curfewReleaseDetails = {
      releaseDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // 1 day
      startTime: '19:00:00',
      endTime: '10:00:00',
      address: 'Primary address',
    }
    const curfewConditionDetails = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15), // 15 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 35), // 35 days
      addresses: ['Primary address'],
    }
    const curfewNights = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const curfewTimetable = curfewNights.flatMap((day: string) => [
      {
        day,
        startTime: '00:00:00',
        endTime: curfewReleaseDetails.endTime,
        addresses: curfewConditionDetails.addresses,
      },
      {
        day,
        startTime: curfewReleaseDetails.startTime,
        endTime: '11:59:00',
        addresses: curfewConditionDetails.addresses,
      },
    ])

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton().click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.AboutTheDeviceWearerSectionItem().click()

      const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
      contactDetailsPage.form.fillInWith(deviceWearerDetails)
      contactDetailsPage.form.saveAndContinueButton.click()

      const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      noFixedAbode.form.saveAndContinueButton.click()

      const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
      primaryAddressPage.form.fillInWith(primaryAddressDetails)
      primaryAddressPage.form.saveAndContinueButton.click()

      const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
      interestedPartiesPage.form.fillInWith(notifyingOrganisation)
      interestedPartiesPage.form.saveAndContinueButton.click()

      const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.saveAndContinueButton().click()

      const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      monitoringConditionsPage.form.saveAndContinueButton.click()

      const installationAddress = Page.verifyOnPage(InstallationAddressPage)
      installationAddress.form.fillInWith(installationAddressDetails)
      installationAddress.form.saveAndContinueButton.click()

      const curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
      curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
      curfewReleaseDatePage.form.saveAndContinueButton.click()

      const curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
      curfewConditionsPage.form.fillInWith(curfewConditionDetails)
      curfewConditionsPage.form.saveAndContinueButton.click()

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.form.fillInWith(curfewTimetable)
      curfewTimetablePage.form.saveAndContinueButton.click()

      const attachmentPage = Page.verifyOnPage(AttachmentPage)
      attachmentPage.backToFormSectionButton.click()

      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submissionFormButton().click()

      cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
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
          disability: [{ disability: '' }],
          address_1: primaryAddressDetails.line1,
          address_2: primaryAddressDetails.line2,
          address_3: primaryAddressDetails.line3,
          address_4: '',
          address_post_code: primaryAddressDetails.postcode,
          secondary_address_1: '',
          secondary_address_2: '',
          secondary_address_3: '',
          secondary_address_4: '',
          secondary_address_post_code: '',
          phone_number: deviceWearerDetails.contactNumber,
          risk_serious_harm: '',
          risk_self_harm: '',
          risk_details: '',
          mappa: '',
          mappa_case_type: '',
          risk_categories: [],
          responsible_adult_required: 'false',
          parent: 'null',
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
          .task('verifyFMSCreateMonitoringOrderRequestReceived', {
            httpStatus: 200,
            body: {
              case_id: fmsCaseId,
              allday_lockdown: '',
              atv_allowance: '',
              condition_type: 'Bail Order',
              court: '',
              court_order_email: '',
              describe_exclusion: '',
              device_type: ',',
              device_wearer: deviceWearerDetails.fullName,
              enforceable_condition: [{ condition: 'Curfew with EM' }],
              exclusion_allday: '',
              interim_court_date: '',
              issuing_organisation: '',
              media_interest: '',
              new_order_received: '',
              notifying_officer_email: '',
              notifying_officer_name: '',
              notifying_organization: '',
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
              order_end: monitoringConditions.endDate.toISOString().split('T')[0],
              order_id: orderId,
              order_request_type: '',
              order_start: monitoringConditions.startDate.toISOString().split('T')[0],
              order_type: 'pre_trial',
              order_type_description: 'DAPOL HDC',
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
              responsible_officer_phone: '',
              responsible_officer_name: '',
              responsible_organization: '',
              ro_post_code: '',
              ro_address_1: '',
              ro_address_2: '',
              ro_address_3: '',
              ro_address_4: '',
              ro_email: '',
              ro_phone: '',
              ro_region: '',
              sentence_date: '',
              sentence_expiry: '',
              tag_at_source: '',
              tag_at_source_details: '',
              technical_bail: '',
              trial_date: '',
              trial_outcome: '',
              conditional_release_date: curfewReleaseDetails.releaseDate.toISOString().split('T')[0],
              reason_for_order_ending_early: '',
              business_unit: '',
              service_end_date: monitoringConditions.endDate.toISOString().split('T')[0],
              curfew_start: curfewConditionDetails.startDate.toISOString().split('T')[0],
              curfew_end: curfewConditionDetails.endDate.toISOString().split('T')[0],
              curfew_duration: [
                {
                  location: 'primary',
                  allday: '',
                  schedule: [
                    {
                      day: 'Mo',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Mo',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Tu',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Tu',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Wed',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Wed',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Th',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Th',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Fr',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Fr',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Sa',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Sa',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                    {
                      day: 'Su',
                      start: '00:00:00',
                      end: '10:00:00',
                    },
                    {
                      day: 'Su',
                      start: '19:00:00',
                      end: '11:59:00',
                    },
                  ],
                },
              ],
              trail_monitoring: '',
              exclusion_zones: '',
              exclusion_zones_duration: '',
              inclusion_zones: '',
              inclusion_zones_duration: '',
              abstinence: '',
              schedule: '',
              checkin_schedule: '',
              revocation_date: '',
              revocation_type: '',
              order_status: 'Not Started',
            },
          })
          .should('be.true')
      })

      const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
      submitSuccessPage.backToYourApplications.click()

      indexPage = Page.verifyOnPage(IndexPage)
      indexPage
        .ordersList()
        .contains(`${deviceWearerDetails.firstNames} ${deviceWearerDetails.lastName} Submitted`)
        .should('exist')
    })
  })
})
