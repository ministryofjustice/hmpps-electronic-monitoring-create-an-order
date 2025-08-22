import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import AboutDeviceWearerPage from '../../../pages/order/about-the-device-wearer/device-wearer'
import {
  createFakeYouthDeviceWearer,
  createFakeInterestedParties,
  createFakeResponsibleAdult,
  createKnownAddress,
} from '../../../mockApis/faker'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import ResponsibleAdultPage from '../../../pages/order/about-the-device-wearer/responsible-adult-details'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber, stubAttachments } from '../../utils'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import UploadLicencePage from '../../../pages/order/attachments/uploadLicence'
import UploadPhotoIdPage from '../../../pages/order/attachments/uploadPhotoId'

// test skipped community YRO is not currently a valid sentence type
context.skip('Scenarios', () => {
  const fmsCaseId: string = uuidv4()
  let orderId: string

  const cacheOrderId = () => {
    cy.url().then((url: string) => {
      const parts = url.replace(Cypress.config().baseUrl, '').split('/')
      ;[, , orderId] = parts
    })
  }
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
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

  context(
    'Youth Rehabilitation Order with Intensive Supervision and Surveillance (Community) with GPS Tag (Location - Fitted).',
    () => {
      const deviceWearerDetails = {
        ...createFakeYouthDeviceWearer('CEMO006'),
        interpreterRequired: false,
        hasFixedAddress: 'Yes',
      }
      const responsibleAdultDetails = createFakeResponsibleAdult()
      const fakePrimaryAddress = createKnownAddress()
      const primaryAddressDetails = {
        ...fakePrimaryAddress,
        hasAnotherAddress: 'No',
      }
      const interestedParties = createFakeInterestedParties(
        'Magistrates Court',
        'YJS',
        'Coventry Magistrates Court',
        'Midlands',
      )
      const monitoringConditions = {
        startDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
        endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 40), // 40 days
        orderType: 'Community',
        conditionType: 'Requirement of a Community Order',
        monitoringRequired: 'Trail monitoring',
        sentenceType: 'Community YRO',
        issp: 'Yes',
        pilot: 'They are not part of any of these pilots',
      }
      const trailMonitoringOrder = {
        startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)), // 15 days
        endDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).setHours(0, 0, 0, 0)), // 35 days
      }

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
        orderSummaryPage.aboutTheDeviceWearerTask.click()

        const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
        aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
        aboutDeviceWearerPage.form.saveAndContinueButton.click()

        const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultPage)
        responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
        responsibleAdultDetailsPage.form.saveAndContinueButton.click()

        const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
        identityNumbersPage.form.fillInWith(deviceWearerDetails)
        identityNumbersPage.form.saveAndContinueButton.click()

        const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(
          DeviceWearerCheckYourAnswersPage,
          'Check your answer',
        )
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

        const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
          ContactInformationCheckYourAnswersPage,
          'Check your answer',
        )
        contactInformationCheckYourAnswersPage.continueButton().click()

        const installationAndRiskPage = Page.verifyOnPage(InstallationAndRiskPage)
        installationAndRiskPage.form.fillInWith(installationAndRisk)
        installationAndRiskPage.form.saveAndContinueButton.click()

        const installationAndRiskCheckYourAnswersPage = Page.verifyOnPage(
          InstallationAndRiskCheckYourAnswersPage,
          'Check your answer',
        )
        installationAndRiskCheckYourAnswersPage.continueButton().click()

        const monitoringConditionsPage = Page.verifyOnPage(MonitoringConditionsPage)
        monitoringConditionsPage.form.fillInWith(monitoringConditions)
        monitoringConditionsPage.form.saveAndContinueButton.click()

        const trailMonitoringPage = Page.verifyOnPage(TrailMonitoringPage)
        trailMonitoringPage.form.fillInWith(trailMonitoringOrder)
        trailMonitoringPage.form.saveAndContinueButton.click()

        const monitoringConditionsCheckYourAnswersPage = Page.verifyOnPage(
          MonitoringConditionsCheckYourAnswersPage,
          'Check your answer',
        )
        monitoringConditionsCheckYourAnswersPage.continueButton().click()

        const licencePage = Page.verifyOnPage(UploadLicencePage)
        licencePage.form.uploadField.uploadFile({ fileName: files.licence.fileName, contents: files.licence.contents })
        licencePage.form.saveAndContinueButton.click()

        const photoPage = Page.verifyOnPage(UploadPhotoIdPage)
        photoPage.form.saveAndContinueButton.click()

        const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)
        attachmentPage.saveAndReturnButton.click()

        orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
        orderSummaryPage.submitOrderButton.click()

        cy.task('verifyFMSCreateDeviceWearerRequestReceived', {
          responseRecordFilename: 'CEMO006',
          httpStatus: 200,
          body: {
            title: '',
            first_name: deviceWearerDetails.firstNames,
            middle_name: '',
            last_name: deviceWearerDetails.lastName,
            alias: deviceWearerDetails.alias,
            date_of_birth: formatAsFmsDate(deviceWearerDetails.dob),
            adult_child: 'child',
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
            secondary_address_1: '',
            secondary_address_2: '',
            secondary_address_3: '',
            secondary_address_4: '',
            secondary_address_post_code: '',
            phone_number: formatAsFmsPhoneNumber(deviceWearerDetails.contactNumber),
            risk_serious_harm: '',
            risk_self_harm: '',
            risk_details: 'No risk',
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
            parent_phone_number: formatAsFmsPhoneNumber(responsibleAdultDetails.contactNumber),
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
              responseRecordFilename: 'CEMO006',
              httpStatus: 200,
              body: {
                case_id: fmsCaseId,
                allday_lockdown: '',
                atv_allowance: '',
                condition_type: 'Requirement of a Community Order',
                court: '',
                court_order_email: '',
                device_type: '',
                device_wearer: deviceWearerDetails.fullName,
                enforceable_condition: [
                  {
                    condition: 'Location Monitoring (Fitted Device)',
                    start_date: formatAsFmsDateTime(trailMonitoringOrder.startDate, 0, 0),
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
                offence: '',
                offence_date: '',
                order_end: formatAsFmsDateTime(monitoringConditions.endDate),
                order_id: orderId,
                order_request_type: 'New Order',
                order_start: formatAsFmsDateTime(monitoringConditions.startDate),
                order_type: 'Community',
                order_type_description: null,
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
                sentence_type: '',
                // sentence_type: 'Community YRO',
                tag_at_source: '',
                tag_at_source_details: '',
                technical_bail: '',
                trial_date: '',
                trial_outcome: '',
                conditional_release_date: '',
                reason_for_order_ending_early: '',
                business_unit: '',
                service_end_date: formatAsFmsDate(monitoringConditions.endDate),
                curfew_description: '',
                curfew_start: '',
                curfew_end: '',
                curfew_duration: [],
                trail_monitoring: 'Yes',
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
                issp: 'Yes',
                hdc: 'No',
                order_status: 'Not Started',
                pilot: '',
              },
            })
            .should('be.true')
        })

        const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
        submitSuccessPage.backToYourApplications.click()

        indexPage = Page.verifyOnPage(IndexPage)
        indexPage.SubmittedOrderFor(deviceWearerDetails.fullName).should('exist')
      })
    },
  )
})
