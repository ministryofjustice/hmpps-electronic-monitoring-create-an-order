import CurfewAdditionalDetailsPage from '../../pages/order/monitoring-conditions/curfew-additional-details'
import CurfewConditionsPage from '../../pages/order/monitoring-conditions/curfew-conditions'
import CurfewReleaseDatePage from '../../pages/order/monitoring-conditions/curfew-release-date'
import CurfewTimetablePage from '../../pages/order/monitoring-conditions/curfew-timetable'
import Page from '../../pages/page'

export default function fillInCurfewOrderDetailsWith({
  curfewReleaseDetails,
  curfewConditionDetails,
  curfewTimetable,
}): void {
  const curfewReleaseDatePage = Page.verifyOnPage(CurfewReleaseDatePage)
  curfewReleaseDatePage.form.fillInWith(curfewReleaseDetails)
  curfewReleaseDatePage.form.saveAndContinueButton.click()

  const curfewConditionsPage = Page.verifyOnPage(CurfewConditionsPage)
  curfewConditionsPage.form.fillInWith(curfewConditionDetails)
  curfewConditionsPage.form.saveAndContinueButton.click()

  const curfewAdditionalDetailsPage = Page.verifyOnPage(CurfewAdditionalDetailsPage)
  curfewAdditionalDetailsPage.form.fillInWith(curfewConditionDetails)
  curfewAdditionalDetailsPage.form.saveAndContinueButton.click()

  const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
  curfewTimetablePage.form.fillInWith(curfewTimetable)
  curfewTimetablePage.form.saveAndContinueButton.click()
}
