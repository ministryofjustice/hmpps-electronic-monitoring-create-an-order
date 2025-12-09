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
import monitoringOrderTypeDescriptionCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import AttachmentSummaryPage from '../../../pages/order/attachments/summary'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'

context('Scenarios', () => {
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
    'Location Monitoring (Inclusion/Exclusion) (Post Release) with GPS Tag (Location - Fitted) (Inclusion/Exclusion zone). Excluded from Football Ground - Variation of home address',
    () => {
      const deviceWearerDetails = {
        ...createFakeAdultDeviceWearer('CEMO017'),
        disabilities: 'Not able to provide this information',
        otherDisability: null,
        interpreterRequired: false,
        hasFixedAddress: 'Yes',
      }
      const fakePrimaryAddress = createKnownAddress()
      const interestedParties = createFakeInterestedParties('Prison', 'Probation', 'Liverpool Prison', 'North West')
      const probationDeliveryUnit = { unit: 'Blackburn' }
      const monitoringOrderTypeDescription = {
        conditionType: 'License condition',
        monitoringCondition: 'Exclusion zone monitoring',
        sentenceType: 'Extended Determinate Sentence',
        prarr: 'No',
      }
      const enforcementZoneDetails = {
        zoneType: 'Exclusion zone',
        startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).setHours(0, 0, 0, 0)), // 10 days
        endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100), // 100 days
        uploadFile: files.licence,
        description: 'Excluded from Football Grounds',
        duration: '90 days',
        anotherZone: 'No',
      }

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
        orderSummaryPage.fillInNewEnforcementZoneOrderWith({
          deviceWearerDetails,
          responsibleAdultDetails: undefined,
          primaryAddressDetails: fakePrimaryAddress,
          secondaryAddressDetails: undefined,
          interestedParties,
          installationAndRisk,
          monitoringOrderTypeDescription,
          enforcementZoneDetails,
          files,
          probationDeliveryUnit,
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
          prison: interestedParties.notifyingOrganisationName,
          notifyingOrganisationEmailAddress: interestedParties.notifyingOrganisationEmailAddress,
        })

        interestedPartiesPage.form.saveAndContinueButton.click()

        const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)

        probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)

        probationDeliveryUnitPage.form.saveAndContinueButton.click()

        Page.verifyOnPage(
          ContactInformationCheckYourAnswersPage,
          'Check your answers',
        ).deviceWearerAddressesSection.changeAnswer("What is the device wearer's main address?")

        Page.verifyOnPage(PrimaryAddressPage).clearAndRepopulate(fakeVariationPrimaryAddress)

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(monitoringOrderTypeDescriptionCheckYourAnswersPage, 'Check your answers').continue()
        Page.verifyOnPage(AttachmentSummaryPage).saveAndReturn()

        orderSummaryPage.submitOrderButton.click()

        cy.task('verifyFMSUpdateDeviceWearerRequestReceived', {
          responseRecordFilename: 'CEMO017',
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
            disability: [
              {
                disability: 'None of the above',
              },
            ],
            address_1: fakeVariationPrimaryAddress.addressLine1,
            address_2:
              fakeVariationPrimaryAddress.addressLine2 === '' ? 'N/A' : fakeVariationPrimaryAddress.addressLine2,
            address_3: fakeVariationPrimaryAddress.addressLine3,
            address_4:
              fakeVariationPrimaryAddress.addressLine4 === '' ? 'N/A' : fakeVariationPrimaryAddress.addressLine4,
            address_post_code: fakeVariationPrimaryAddress.postcode,
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
              responseRecordFilename: 'CEMO017',
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
                    condition: 'EM Exclusion / Inclusion Zone',
                    start_date: formatAsFmsDateTime(enforcementZoneDetails.startDate, 0, 0),
                    end_date: formatAsFmsDateTime(enforcementZoneDetails.endDate, 23, 59),
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
                order_end: formatAsFmsDateTime(enforcementZoneDetails.endDate, 23, 59),
                order_id: orderId,
                order_request_type: 'Variation',
                order_start: formatAsFmsDateTime(enforcementZoneDetails.startDate, 0, 0),
                order_type: 'Post Release',
                order_type_description: null,
                order_type_detail: '',
                order_variation_date: formatAsFmsDateTime(variationDetails.variationDate),
                order_variation_details: 'Change to address',
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
                sentence_type: 'Extended Determinate Sentence',
                tag_at_source: '',
                tag_at_source_details: '',
                date_and_time_installation_will_take_place: '',
                released_under_prarr: 'false',
                technical_bail: '',
                trial_date: '',
                trial_outcome: '',
                conditional_release_date: '',
                conditional_release_start_time: '',
                conditional_release_end_time: '',
                reason_for_order_ending_early: '',
                business_unit: '',
                service_end_date: formatAsFmsDate(enforcementZoneDetails.endDate),
                curfew_description: '',
                curfew_start: '',
                curfew_end: '',
                curfew_duration: [],
                trail_monitoring: 'No',
                exclusion_zones: [
                  {
                    description: enforcementZoneDetails.description,
                    duration: enforcementZoneDetails.duration,
                    start: formatAsFmsDate(enforcementZoneDetails.startDate),
                    end: formatAsFmsDate(enforcementZoneDetails.endDate),
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
                hdc: 'No',
                order_status: 'Not Started',
                pilot: '',
                subcategory: 'SR08 - Amend monitoring requirements',
              },
            })
            .should('be.true')
        })

        // Verify the attachments were sent to the FMS API
        cy.readFile(files.licence.contents, 'base64').then(contentAsBase64 => {
          cy.task('verifyFMSAttachmentRequestReceived', {
            responseRecordFilename: 'CEMO001',
            httpStatus: 200,
            fileContents: contentAsBase64,
          })
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
