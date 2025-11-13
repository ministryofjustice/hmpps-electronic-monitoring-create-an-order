import { createAddressPreview } from '../../../server/utils/utils'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
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

export function verifyCurfewInCheckYourAnswersPage({
  curfewReleaseDetails = undefined,
  curfewConditionDetails = undefined,
  curfewTimetable = undefined,
  mainAddress = undefined,
}): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')

  if (curfewReleaseDetails) {
    page.curfewOnDayOfReleaseSection.shouldExist()
    page.curfewOnDayOfReleaseSection.shouldHaveItems([
      {
        key: 'What date is the device wearer released from custody?',
        value: curfewReleaseDetails.releaseDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'On the day of release, what time does the curfew start?',
        value: `${curfewReleaseDetails.startTime.hours}:${curfewReleaseDetails.startTime.minutes}`,
      },
      {
        key: 'On the day after release, what time does the curfew end?',
        value: `${curfewReleaseDetails.endTime.hours}:${curfewReleaseDetails.endTime.minutes}`,
      },
      {
        key: 'On the day of release, where will the device wearer be during curfew hours?',
        value: createAddressPreview(mainAddress),
      },
    ])
  } else {
    page.curfewOnDayOfReleaseSection.shouldNotExist()
  }

  if (curfewConditionDetails) {
    page.curfewSection.shouldExist()
    page.curfewSection.shouldHaveItems([
      {
        key: 'What date does the curfew start?',
        value: curfewConditionDetails.startDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What date does the curfew end?',
        value: curfewConditionDetails.endDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'Where will the device wearer be during curfew hours?',
        value: createAddressPreview(mainAddress),
      },
    ])
    if (curfewConditionDetails.curfewAdditionalDetails) {
      page.curfewSection.shouldHaveItems([
        {
          key: 'Do you want to change the standard curfew address boundary for any of the curfew addresses?',
          value: curfewConditionDetails.curfewAdditionalDetails,
        },
      ])
    }
  } else {
    page.curfewSection.shouldNotExist()
  }

  if (curfewTimetable) {
    page.curfewTimetableSection().shouldExist()
  } else {
    page.curfewTimetableSection().shouldNotExist()
  }
}
