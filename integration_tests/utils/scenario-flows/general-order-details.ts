import Page from '../../pages/page'
import AboutDeviceWearerPage from '../../pages/order/about-the-device-wearer/device-wearer'
import DeviceWearerSearchResultsPage from '../../pages/order/about-the-device-wearer/device-wearer-search-results'
import ResponsibleAdultDetailsPage from '../../pages/order/about-the-device-wearer/responsible-adult-details'
import DeviceWearerCheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import IdentityNumbersPage, {
  identityNumberNamesForNotifyingOrganisation,
} from '../../pages/order/about-the-device-wearer/identity-numbers'
import ContactDetailsPage from '../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../pages/order/contact-information/no-fixed-abode'
import InterestedPartiesPage from '../../pages/order/contact-information/interested-parties'
import ProbationDeliveryUnitPage from '../../pages/order/contact-information/probation-delivery-unit'
import ContactInformationCheckYourAnswersPage from '../../pages/order/contact-information/check-your-answers'
import fillInOrderTypeDescriptionsWith from './orderTypeDescription'
import fillInAboutTheDeviceWearer from './about-the-device-wearer-flow.cy'
import fillinAddress from './postcode-lookup.cy'

export function fillInDeviceWearerWith({ deviceWearerDetails, responsibleAdultDetails, interestedParties }): void {
  const searchedIdentifier =
    deviceWearerDetails.pncId ||
    deviceWearerDetails.nomisId ||
    deviceWearerDetails.prisonNumber ||
    deviceWearerDetails.deliusId ||
    deviceWearerDetails.complianceAndEnforcementPersonReference ||
    deviceWearerDetails.courtCaseReferenceNumber

  const identityNumberNames = identityNumberNamesForNotifyingOrganisation(interestedParties?.notifyingOrganisation)
  const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage, {}, {}, identityNumberNames)
  identityNumbersPage.form.fillInWith(deviceWearerDetails)
  identityNumbersPage.form.saveAndContinueButton.click()

  if (
    interestedParties?.notifyingOrganisation === 'Probation service' ||
    interestedParties?.notifyingOrganisation === 'Prison' ||
    interestedParties?.notifyingOrganisation === 'Prison Service' ||
    interestedParties?.notifyingOrganisation === 'Youth Custody Service'
  ) {
    const deviceWearerSearchResultsPage = Page.verifyOnPage(DeviceWearerSearchResultsPage, {
      identifyNumber: searchedIdentifier,
    })
    deviceWearerSearchResultsPage.form.enterDetailsManuallyLink.click()
  }

  const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
  aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
  aboutDeviceWearerPage.form.saveAndContinueButton.click()

  if (responsibleAdultDetails) {
    const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
    responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
    responsibleAdultDetailsPage.form.saveAndContinueButton.click()
  }

  const deviceWearerCheckYourAnswersPage = Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  deviceWearerCheckYourAnswersPage.continueButton().click()
}

export function fillInContactDetailsAndAddressesWith({
  deviceWearerDetails,
  primaryAddressDetails,
  secondaryAddressDetails,
  tertiaryAddressDetails,
}): void {
  const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
  contactDetailsPage.form.fillInWith(deviceWearerDetails)
  contactDetailsPage.form.saveAndContinueButton.click()

  const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
  noFixedAbode.form.fillInWith(deviceWearerDetails)
  noFixedAbode.form.saveAndContinueButton.click()

  if (primaryAddressDetails) {
    fillinAddress({
      findAddress: {},
      addressResult: {},
      enterAddress: primaryAddressDetails,
      addAnother: secondaryAddressDetails === undefined ? 'No' : 'Yes',
    })

    if (secondaryAddressDetails !== undefined) {
      fillinAddress({
        findAddress: {},
        addressResult: {},
        enterAddress: secondaryAddressDetails,
        addAnother: tertiaryAddressDetails === undefined ? 'No' : 'Yes',
        addressType: 'SECONDARY',
      })
    }

    if (tertiaryAddressDetails !== undefined) {
      fillinAddress({
        findAddress: {},
        addressResult: {},
        enterAddress: tertiaryAddressDetails,
        addressType: 'TERTIARY',
      })
    }
  }
}

export function fillInInterestedPartiesWith({ interestedParties, probationDeliveryUnit }): void {
  if (interestedParties) {
    const interestedPartiesPage = Page.verifyOnPage(InterestedPartiesPage)
    interestedPartiesPage.form.fillInWith(interestedParties)
    interestedPartiesPage.form.saveAndContinueButton.click()

    if (interestedParties.responsibleOrganisation === 'Probation' && probationDeliveryUnit !== undefined) {
      const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
      probationDeliveryUnitPage.form.fillInWith(probationDeliveryUnit)
      probationDeliveryUnitPage.form.saveAndContinueButton.click()
    }
    const contactInformationCheckYourAnswersPage = Page.verifyOnPage(
      ContactInformationCheckYourAnswersPage,
      'Check your answer',
    )
    contactInformationCheckYourAnswersPage.continueButton().click()
  }
}

export function fillInNewDeviceWearerWith({
  deviceWearerDetails,
  responsibleAdultDetails = undefined,
  primaryAddressDetails = undefined,
  secondaryAddressDetails = undefined,
  tertiaryAddressDetails = undefined,
  interestedParties = undefined,
}): DeviceWearerCheckYourAnswersPage {
  fillInAboutTheDeviceWearer({
    deviceWearerDetails,
    responsibleAdultDetails,
    primaryAddressDetails,
    secondaryAddressDetails,
    tertiaryAddressDetails,
    notifyingOrganisation: interestedParties?.notifyingOrganisation,
  })
  return Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
}

export function fillInGeneralOrderDetailsWith({
  deviceWearerDetails,
  responsibleAdultDetails = undefined,
  primaryAddressDetails = undefined,
  secondaryAddressDetails = undefined,
  interestedParties = undefined,
  probationDeliveryUnit = undefined,
  tertiaryAddressDetails = undefined,
  monitoringOrderTypeDescription = undefined,
  newDeviceWearerFlow = false,
}): void {
  if (newDeviceWearerFlow) {
    fillInNewDeviceWearerWith({
      deviceWearerDetails,
      responsibleAdultDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      tertiaryAddressDetails,
      interestedParties,
    }).continue()
  } else {
    fillInDeviceWearerWith({ deviceWearerDetails, responsibleAdultDetails, interestedParties })
    fillInContactDetailsAndAddressesWith({
      deviceWearerDetails,
      primaryAddressDetails,
      secondaryAddressDetails,
      tertiaryAddressDetails,
    })
    fillInInterestedPartiesWith({ interestedParties, probationDeliveryUnit })
  }

  if (monitoringOrderTypeDescription) {
    fillInOrderTypeDescriptionsWith(monitoringOrderTypeDescription)
  }
}
