import DeviceWearerCheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import AboutDeviceWearerPage from '../../pages/order/about-the-device-wearer/device-wearer'
import IdentityNumbersPage from '../../pages/order/about-the-device-wearer/identity-numbers'
import ResponsibleAdultDetailsPage from '../../pages/order/about-the-device-wearer/responsible-adult-details'
import ContactDetailsPage from '../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../pages/order/contact-information/primary-address'
import SecondaryAddressPage from '../../pages/order/contact-information/secondary-address'
import TertiaryAddressPage from '../../pages/order/contact-information/tertiary-adddress'

import Page from '../../pages/page'

export default function fillInAboutTheDeviceWearer({
  deviceWearerDetails,
  responsibleAdultDetails = undefined,
  primaryAddressDetails = undefined,
  secondaryAddressDetails = undefined,
  tertiaryAddressDetails = undefined,
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

  const contactDetailsPage = Page.verifyOnPage(ContactDetailsPage)
  contactDetailsPage.form.fillInWith(deviceWearerDetails)
  contactDetailsPage.form.saveAndContinueButton.click()

  const noFixedAbode = Page.verifyOnPage(NoFixedAbodePage)
  noFixedAbode.form.fillInWith(deviceWearerDetails)
  noFixedAbode.form.saveAndContinueButton.click()

  if (primaryAddressDetails) {
    const primaryAddressPage = Page.verifyOnPage(PrimaryAddressPage)
    primaryAddressPage.form.fillInWith({
      ...primaryAddressDetails,
      hasAnotherAddress: secondaryAddressDetails === undefined ? 'No' : 'Yes',
    })
    primaryAddressPage.form.saveAndContinueButton.click()

    if (secondaryAddressDetails !== undefined) {
      const secondaryAddressPage = Page.verifyOnPage(SecondaryAddressPage)
      secondaryAddressPage.form.fillInWith({
        ...secondaryAddressDetails,
        hasAnotherAddress: tertiaryAddressDetails === undefined ? 'No' : 'Yes',
      })
      secondaryAddressPage.form.saveAndContinueButton.click()
    }

    if (tertiaryAddressDetails !== undefined) {
      const tertiaryAddressPage = Page.verifyOnPage(TertiaryAddressPage)
      tertiaryAddressPage.form.fillInWith({
        ...tertiaryAddressDetails,
      })
      tertiaryAddressPage.form.saveAndContinueButton.click()
    }

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answer')
  }
}
