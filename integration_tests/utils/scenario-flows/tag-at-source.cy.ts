import { createAddressPreview, trimSeconds } from '../../../server/utils/utils'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import InstallationAddressPage from '../../pages/order/monitoring-conditions/installation-address'
import InstallationAppointmentPage from '../../pages/order/monitoring-conditions/installation-appointment'
import InstallationLocationPage from '../../pages/order/monitoring-conditions/installation-location'
import Page from '../../pages/page'

export default function fillInTagAtSourceWith(
  installationLocation,
  installationAppointment = undefined,
  installationAddressDetails = undefined,
): void {
  const installationLocationPage = Page.verifyOnPage(InstallationLocationPage)
  installationLocationPage.form.fillInWith(installationLocation)
  installationLocationPage.form.saveAndContinueButton.click()

  if (installationAppointment) {
    const installationAppointmentPage = Page.verifyOnPage(InstallationAppointmentPage)
    installationAppointmentPage.form.fillInWith(installationAppointment)
    installationAppointmentPage.form.saveAndContinueButton.click()
  }
  if (installationAddressDetails) {
    const installationAddress = Page.verifyOnPage(InstallationAddressPage)
    installationAddress.form.fillInWith(installationAddressDetails)
    installationAddress.form.saveAndContinueButton.click()
  }
}

export function verifyTagAtSourceInCheckYourAnswersPage(
  installationLocation = undefined,
  installationAppointment = undefined,
  installationAddressDetails = undefined,
): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')
  if (installationLocation) {
    page.installationLocationSection().shouldExist()
    page.installationLocationSection().shouldHaveItems([
      {
        key: 'Where will installation of the electronic monitoring device take place?',
        value: installationLocation.location,
      },
    ])
  } else {
    page.installationLocationSection().shouldNotExist()
  }

  if (installationAppointment) {
    page.installationAppointmentSection().shouldExist()
    page.installationAppointmentSection().shouldHaveItems([
      {
        key: 'What is the name of the place where installation will take place?',
        value: installationAppointment.placeName,
      },
      {
        key: 'What date will installation take place?',
        value: installationAppointment.appointmentDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What time will installation take place?',
        value: trimSeconds(installationAppointment.appointmentDate.toLocaleTimeString('en-GB')),
      },
    ])
  } else {
    page.installationAppointmentSection().shouldNotExist()
  }

  if (installationAddressDetails) {
    page.installationAddressSection().shouldExist()
    page.installationAddressSection().shouldHaveItems([
      {
        key: 'At what address will installation of the electronic monitoring device take place?',
        value: createAddressPreview(installationAddressDetails),
      },
    ])
  } else {
    page.installationAddressSection().shouldNotExist()
  }
}
