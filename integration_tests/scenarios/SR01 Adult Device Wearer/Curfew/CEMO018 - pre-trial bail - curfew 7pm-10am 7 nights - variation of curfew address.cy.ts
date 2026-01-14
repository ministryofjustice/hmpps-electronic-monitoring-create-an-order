import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import IndexPage from '../../../pages/index'
import OrderSummaryPage from '../../../pages/order/summary'
import { createFakeAdultDeviceWearer, createFakeInterestedParties, createKnownAddress } from '../../../mockApis/faker'
import SubmitSuccessPage from '../../../pages/order/submit-success'
import VariationSubmitSuccessPage from '../../../pages/order/variation-submit-success'
import { formatAsFmsDateTime, formatAsFmsDate, formatAsFmsPhoneNumber, stubAttachments } from '../../utils'
import SearchPage from '../../../pages/search'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import IsRejectionPage from '../../../e2e/order/edit-order/is-rejection/isRejectionPage'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

context('Scenarios', () => {
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
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
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
    'Pre-Trial Bail with Radio Frequency (RF) (HMU + PID) on a Curfew 7pm-10am - Variation of curfew address',
    () => {
      const deviceWearerDetails = {
        ...createFakeAdultDeviceWearer('CEMO018'),
        disabilities: 'The device wearer does not have any of the disabilities or health conditions listed',
        otherDisability: null,
        interpreterRequired: false,
        hasFixedAddress: 'Yes',
      }
      const fakePrimaryAddress = createKnownAddress()
      const interestedParties = createFakeInterestedParties('Crown Court', 'Police', 'Bolton Crown Court')

      const monitoringOrderTypeDescription = {
        orderType: 'Community',
        monitoringCondition: 'Curfew',
        sentenceType: 'Supervision Default Order',
      }
      const curfewReleaseDetails = {
        startTime: { hours: '19', minutes: '00' },
        endTime: { hours: '10', minutes: '00' },
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
          endTime: '10:00:00',
          addresses: curfewConditionDetails.addresses,
        },
      ])

      const variationDetails = {
        variationType: 'The device wearer’s address',
        variationDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).setHours(0, 0, 0, 0)), // 20 days
        variationDetails: 'Change to address',
      }
      let fakeVariationPrimaryAddress = createKnownAddress()
      while (fakeVariationPrimaryAddress.postcode === fakePrimaryAddress.postcode) {
        fakeVariationPrimaryAddress = createKnownAddress()
      }

      const installationAndRisk = {
        offence: 'Sexual offences',
        possibleRisk: 'There are no risks that the installer should be aware of',
        riskDetails: 'No risk',
      }

      it('Should successfully submit the order to the FMS API', () => {
        cy.signIn()

        let indexPage = Page.verifyOnPage(IndexPage)
        indexPage.newOrderFormButton.click()

        const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)
        cacheOrderId()

        const attachmentFiles = {
          courtOrder: {
            fileName: files.licence.fileName,
            contents: files.licence.contents,
            fileRequired: 'Yes',
          },
        }
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
          files: attachmentFiles,
          probationDeliveryUnit: undefined,
        })
        orderSummaryPage.submitOrderButton.click()

        const submitSuccessPage = Page.verifyOnPage(SubmitSuccessPage)
        submitSuccessPage.backToYourApplications.click()

        indexPage = Page.verifyOnPage(IndexPage)
        indexPage.searchNav.click()

        let searchPage = Page.verifyOnPage(SearchPage)
        searchPage.searchBox.type(deviceWearerDetails.lastName)
        searchPage.searchButton.click()

        searchPage.ordersList.contains(deviceWearerDetails.fullName).click()

        Page.verifyOnPage(OrderSummaryPage).makeChanges()

        Page.verifyOnPage(ConfirmVariationPage).confirm()

        Page.verifyOnPage(IsRejectionPage).isNotRejection()

        orderSummaryPage.fillInVariationsDetails({ variationDetails })
        orderSummaryPage.aboutTheDeviceWearerTask.click()

        Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers').continue()

        const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
        contactDetailsPage.form.saveAndContinueButton.click()

        const noFixedAbodePage = Page.verifyOnPage(NoFixedAbodePage)
        noFixedAbodePage.form.saveAndContinueButton.click()

        const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
        primaryAddressPage.form.saveAndContinueButton.click()

        const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)

        interestedPartiesPage.form.fillInWith({
          notifyingOrganisation: interestedParties.notifyingOrganisation,
          crownCourt: interestedParties.notifyingOrganisationName,
          notifyingOrganisationEmailAddress: interestedParties.notifyingOrganisationEmailAddress,
        })

        interestedPartiesPage.form.saveAndContinueButton.click()

        Page.verifyOnPage(
          ContactInformationCheckYourAnswersPage,
          'Check your answers',
        ).deviceWearerAddressesSection.changeAnswer("What is the device wearer's main address?")

        Page.verifyOnPage(PrimaryAddressPage).clearAndRepopulate(fakeVariationPrimaryAddress)

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

        orderSummaryPage.submitOrderButton.click()

        cy.wrap(orderId).then(() => {
          return cy
            .task('verifyFMSUpdateMonitoringOrderRequestReceived', {
              responseRecordFilename: 'CEMO018',
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
                order_end: formatAsFmsDateTime(curfewConditionDetails.endDate, 23, 59),
                order_id: orderId,
                order_request_type: 'Variation',
                order_start: formatAsFmsDateTime(curfewConditionDetails.startDate),
                order_type: 'Community',
                order_type_description: null,
                order_type_detail: '',
                order_variation_date: formatAsFmsDateTime(variationDetails.variationDate),
                order_variation_details: variationDetails.variationDetails,
                order_variation_req_received_date: '',
                order_variation_type: 'Change to Address',
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
                sentence_type: 'Supervision Default Order',
                tag_at_source: '',
                tag_at_source_details: '',
                date_and_time_installation_will_take_place: '',
                released_under_prarr: 'false',
                technical_bail: '',
                trial_date: '',
                trial_outcome: '',
                conditional_release_date: formatAsFmsDate(curfewConditionDetails.startDate),
                conditional_release_start_time: '19:00:00',
                conditional_release_end_time: '10:00:00',
                reason_for_order_ending_early: '',
                business_unit: '',
                service_end_date: formatAsFmsDate(curfewConditionDetails.endDate),
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
                        end: '10:00:00',
                      },
                      {
                        day: 'Tu',
                        start: '19:00:00',
                        end: '10:00:00',
                      },
                      {
                        day: 'Wed',
                        start: '19:00:00',
                        end: '10:00:00',
                      },
                      {
                        day: 'Th',
                        start: '19:00:00',
                        end: '10:00:00',
                      },
                      {
                        day: 'Fr',
                        start: '19:00:00',
                        end: '10:00:00',
                      },
                      {
                        day: 'Sa',
                        start: '19:00:00',
                        end: '10:00:00',
                      },
                      {
                        day: 'Su',
                        start: '19:00:00',
                        end: '10:00:00',
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
                hdc: 'No',
                order_status: 'Not Started',
                pilot: '',
                subcategory: 'SR08-Amend monitoring requirements',
                dapol_missed_in_error: '',
              },
            })
            .should('be.true')
        })

        const variationSubmitSuccessPage = Page.verifyOnPage(VariationSubmitSuccessPage)
        variationSubmitSuccessPage.backToYourApplications.click()

        indexPage = Page.verifyOnPage(IndexPage)
        indexPage.searchNav.click()

        searchPage = Page.verifyOnPage(SearchPage)
        searchPage.searchBox.type(deviceWearerDetails.lastName)
        searchPage.searchButton.click()
        searchPage.ordersList.contains(deviceWearerDetails.fullName)
      })
    },
  )
})
