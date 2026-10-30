import paths from '../../../server/constants/paths'
import DeviceWearerCheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import DeviceWearerDetailsPage from '../../pages/order/about-the-device-wearer/device-wearer-details'
import DisabilitiesPage from '../../pages/order/about-the-device-wearer/disabilities'
import LanguagePage from '../../pages/order/about-the-device-wearer/language'
import AdultAtInstallationPage from '../../pages/order/about-the-device-wearer/adult-at-installation'
import IdentityNumbersPage, {
  identityNumberNamesForNotifyingOrganisation,
} from '../../pages/order/about-the-device-wearer/identity-numbers'
import DeviceWearerSearchResultsPage from '../../pages/order/about-the-device-wearer/device-wearer-search-results'

import ResponsibleAdultDetailsPage from '../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../pages/order/contact-information/no-fixed-abode'
import Page from '../../pages/page'
import fillinAddress from './postcode-lookup.cy'

const submitIfOnPage = (path: string, submit: () => void): void => {
  cy.location('pathname').then(pathname => {
    if (pathname.endsWith(path.replace(paths.ORDER.BASE_URL, ''))) {
      submit()
      cy.location('pathname').should('not.equal', pathname)
    }
  })
}

export default function fillInAboutTheDeviceWearer({
  deviceWearerDetails,
  responsibleAdultDetails = undefined,
  primaryAddressDetails = undefined,
  secondaryAddressDetails = undefined,
  tertiaryAddressDetails = undefined,
  section = 'About the device wearer',
  notifyingOrganisation = undefined,
  loadFromCPR = false,
}): void {
  const identityNumberNames = identityNumberNamesForNotifyingOrganisation(notifyingOrganisation)
  const searchedIdentifier =
    deviceWearerDetails.nomisId ||
    deviceWearerDetails.deliusId ||
    deviceWearerDetails.pncId ||
    deviceWearerDetails.prisonNumber ||
    deviceWearerDetails.complianceAndEnforcementPersonReference ||
    deviceWearerDetails.courtCaseReferenceNumber

  submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS, () => {
    const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage, {}, {}, identityNumberNames)
    identityNumbersPage.form.fillInWith(deviceWearerDetails)
    identityNumbersPage.form.saveAndContinueButton.click()
  })

  if (
    notifyingOrganisation === 'Probation' ||
    notifyingOrganisation === 'Probation service' ||
    notifyingOrganisation === 'Prison' ||
    notifyingOrganisation === 'Prison Service' ||
    notifyingOrganisation === 'Youth Custody Service'
  ) {
    submitIfOnPage(
      paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS.replace(':identifyNumber', searchedIdentifier),
      () => {
        const deviceWearerSearchResultsPage = Page.verifyOnPage(DeviceWearerSearchResultsPage, {
          identifyNumber: searchedIdentifier,
        })
        if (loadFromCPR) {
          deviceWearerSearchResultsPage.form.useThisDeviceWearerButton.click()
        } else {
          deviceWearerSearchResultsPage.form.enterDetailsManuallyLink.click()
        }
      },
    )
  }

  submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS, () => {
    const deviceWearerDetailsPage = Page.verifyOnPage(DeviceWearerDetailsPage)
    deviceWearerDetailsPage.form.fillInWith(deviceWearerDetails)
    deviceWearerDetailsPage.form.continueButton.click()
  })

  submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES, () => {
    const disabilitiesPage = Page.verifyOnPage(DisabilitiesPage)
    if (deviceWearerDetails.disabilities) {
      disabilitiesPage.form.disabilitiesField.set(deviceWearerDetails.disabilities)
    }
    if (deviceWearerDetails.otherDisability) {
      disabilitiesPage.form.otherDisabilityField.clear().type(deviceWearerDetails.otherDisability)
    }
    disabilitiesPage.form.continueButton.click()
  })

  submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE, () => {
    const languagePage = Page.verifyOnPage(LanguagePage)
    if (deviceWearerDetails.interpreterRequired !== undefined) {
      languagePage.form.interpreterRequiredField.set(deviceWearerDetails.interpreterRequired ? 'Yes' : 'No')
    }
    languagePage.form.fillInWith({
      language: deviceWearerDetails.language,
    })
    languagePage.form.continueButton.click()
  })

  submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION, () => {
    const adultAtInstallationPage = Page.verifyOnPage(AdultAtInstallationPage)
    if (deviceWearerDetails.is18 !== undefined) {
      adultAtInstallationPage.form.fillInWith(deviceWearerDetails.is18 ? 'No' : 'Yes')
    }
    adultAtInstallationPage.form.continueButton.click()
  })

  if (responsibleAdultDetails) {
    submitIfOnPage(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, () => {
      const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
      responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
      responsibleAdultDetailsPage.form.saveAndContinueButton.click()
    })
  }

  if (!deviceWearerDetails.hideContactNumberPage) {
    submitIfOnPage(paths.CONTACT_INFORMATION.CONTACT_DETAILS, () => {
      const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage, section)
      contactDetailsPage.form.fillInWith(deviceWearerDetails)
      contactDetailsPage.form.saveAndContinueButton.click()
    })
  }

  if (deviceWearerDetails.hasFixedAddress) {
    submitIfOnPage(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, () => {
      const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage, section)
      noFixedAbode.form.fillInWith(deviceWearerDetails)
      noFixedAbode.form.saveAndContinueButton.click()
    })
  }

  if (primaryAddressDetails) {
    submitIfOnPage(paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':addressType', 'PRIMARY'), () => {
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
    })
  }

  cy.location('pathname').then(pathname => {
    if (pathname.endsWith(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(paths.ORDER.BASE_URL, ''))) {
      Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
    }
  })
}
