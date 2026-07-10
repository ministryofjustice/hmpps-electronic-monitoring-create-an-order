import DeviceWearerCheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import AboutDeviceWearerPage from '../../pages/order/about-the-device-wearer/device-wearer'
import IdentityNumbersPage from '../../pages/order/about-the-device-wearer/identity-numbers'
import ResponsibleAdultDetailsPage from '../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../pages/order/contact-information/no-fixed-abode'
import Page from '../../pages/page'
import fillinAddress from './postcode-lookup.cy'

export default function fillInAboutTheDeviceWearer({
  deviceWearerDetails,
  responsibleAdultDetails = undefined,
  primaryAddressDetails = undefined,
  secondaryAddressDetails = undefined,
  tertiaryAddressDetails = undefined,
  section = 'About the device wearer',
}): void {
  const identityNumbersPage = Page.verifyOnPage(IdentityNumbersPage)
  identityNumbersPage.form.fillInWith(deviceWearerDetails)
  identityNumbersPage.form.saveAndContinueButton.click()

  const aboutDeviceWearerPage = Page.verifyOnPage(AboutDeviceWearerPage)
  aboutDeviceWearerPage.form.fillInWith(deviceWearerDetails)
  aboutDeviceWearerPage.form.saveAndContinueButton.click()

  if (responsibleAdultDetails) {
    const responsibleAdultDetailsPage = Page.verifyOnPage(ResponsibleAdultDetailsPage)
    responsibleAdultDetailsPage.form.fillInWith(responsibleAdultDetails)
    responsibleAdultDetailsPage.form.saveAndContinueButton.click()
  }

  const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage, section)
  contactDetailsPage.form.fillInWith(deviceWearerDetails)
  contactDetailsPage.form.saveAndContinueButton.click()

  const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage, section)
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

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  }
}
