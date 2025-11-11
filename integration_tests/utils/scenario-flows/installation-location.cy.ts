import InstallationAddressPage from '../../pages/order/monitoring-conditions/installation-address'
import InstallationAppointmentPage from '../../pages/order/monitoring-conditions/installation-appointment'
import InstallationLocationPage from '../../pages/order/monitoring-conditions/installation-location'
import Page from '../../pages/page'

export default function fillInInsllationLocationWith({
  installationLocation,
  installationAppointment = undefined,
  installationAddressDetails = undefined,
}): void {
  const installationLocationPage = Page.verifyOnPage(InstallationLocationPage)
  installationLocationPage.form.fillInWith(installationLocation)
  installationLocationPage.form.saveAndContinueButton.click()

  if (installationAppointment) {
    const installationAppointmentPage = Page.verifyOnPage(InstallationAppointmentPage)
    installationAppointmentPage.form.fillInWith(installationAppointment)
    installationAppointmentPage.form.saveAndContinueButton.click()

    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()
  }
}
