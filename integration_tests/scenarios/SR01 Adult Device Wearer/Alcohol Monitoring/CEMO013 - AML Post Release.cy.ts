import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createFakeAddress } from '../../../mockApis/faker'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import { formatAsFmsDateTime } from '../../utils'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'

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

  context('Alcohol Monitoring on License Order - AML (Post Release)', () => {
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
    const interestedParties = createFakeInterestedParties()
    const monitoringConditions = {
      startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
      orderType: 'Post Release',
      orderTypeDescription: 'DAPOL HDC',
      conditionType: 'Bail Order',
      monitoringRequired: 'Alcohol monitoring',
    }
    const alcoholMonitoringOrder = {
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
      endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
      monitoringType: 'Alcohol abstinence',
      installLocation: `at Installation Address: ${installationAddressDetails}`,
    }

    it('Should successfully submit the order to the FMS API', () => {
      cy.signIn()

      let indexPage = Page.verifyOnPage(IndexPage)
      indexPage.newOrderFormButton.click()

      let orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      cacheOrderId()
      orderSummaryPage.deviceWearerTask.click()

      const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
      aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
      aboutDeviceWearerPage.form.saveAndContinueButton.click()

      const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
      identityNumbersPage.form.fillInWith(deviceWearerDetails)
      identityNumbersPage.form.saveAndContinueButton.click()

      const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage)
      deviceWearerCheckYourAnswersPage.continueButton().click()

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
      interestedPartiesPage.form.fillInWith(interestedParties)
      interestedPartiesPage.form.saveAndContinueButton.click()

      const contactInformationCheckYourAnswersPage = Page.verifyOnPage(ContactInformationCheckYourAnswersPage)
      contactInformationCheckYourAnswersPage.continueButton().click()

      const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
      installationAndRiskPage.saveAndContinueButton().click()

      const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
      monitoringConditionsPage.form.fillInWith(monitoringConditions)
      monitoringConditionsPage.form.saveAndContinueButton.click()

      const installationAddress = Page.verifyOnPage(InstallationAddressPage)
      installationAddress.form.fillInWith(installationAddressDetails)
      installationAddress.form.saveAndContinueButton.click()

      const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage)
      alcoholMonitoringPage.form.fillInWith(alcoholMonitoringOrder)
      alcoholMonitoringPage.form.saveAndContinueButton.click()

      const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage)
      monitoringConditionsCheckYourAnswersPage.continueButton().click()

      const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
      attachmentPage.backToSummaryButton.click()

      orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
      orderSummaryPage.submitOrderButton.click()

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
          disability: [],
          address_1: primaryAddressDetails.line1,
          address_2: primaryAddressDetails.line2,
          address_3: primaryAddressDetails.line3,
          address_4: 'N/A',
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
          .task('verifyFMSCreateMonitoringOrderRequestReceived', {
            httpStatus: 200,
            body: {
              case_id: fmsCaseId,
              allday_lockdown: '',
              atv_allowance: '',
              condition_type: 'Bail Order',
              court: '',
              court_order_email: '',
              device_type: '',
              device_wearer: deviceWearerDetails.fullName,
              enforceable_condition: [
                {
                  condition: 'AAMR',
                  start_date: formatAsFmsDateTime(alcoholMonitoringOrder.startDate),
                  end_date: formatAsFmsDateTime(alcoholMonitoringOrder.endDate),
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
              order_type: 'Post Release',
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
              installation_address_1: installationAddressDetails.line1,
              installation_address_2: installationAddressDetails.line2,
              installation_address_3: installationAddressDetails.line3 ?? '',
              installation_address_4: installationAddressDetails.line4 ?? '',
              installation_address_post_code: installationAddressDetails.postcode,
              crown_court_case_reference_number: '',
              magistrate_court_case_reference_number: '',
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
