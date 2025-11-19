import HdcPage from '../../e2e/order/monitoring-conditions/order-type-description/hdc/hdcPage'
import IsspPage from '../../e2e/order/monitoring-conditions/order-type-description/issp/isspPage'
import MonitoringDatesPage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-dates/MonitoringDatesPage'
import MonitoringTypesPage from '../../e2e/order/monitoring-conditions/order-type-description/monitoring-types/MonitoringTypesPage'
import OffenceTypePage from '../../e2e/order/monitoring-conditions/order-type-description/offence-type/OffenceTypePage'
import OrderTypePage from '../../e2e/order/monitoring-conditions/order-type-description/order-type/OrderTypePage'
import PilotPage from '../../e2e/order/monitoring-conditions/order-type-description/pilot/PilotPage'
import PoliceAreaPage from '../../e2e/order/monitoring-conditions/order-type-description/police-area/PoliceAreaPage'
import PrarrPage from '../../e2e/order/monitoring-conditions/order-type-description/prarr/PrarrPage'
import SentenceTypePage from '../../e2e/order/monitoring-conditions/order-type-description/sentence-type/SentenceTypePage'
import SingleQuestionFormComponent from '../../pages/components/SingleQuestionFormComponent'
import Page from '../../pages/page'

const fillinSingleQuestionFormWith = (form: SingleQuestionFormComponent, value: string) => {
  form.fillInWith(value)
  form.continueButton.click()
}

export default function fillInOrderTypeDescriptionsWith({
  orderType = undefined,
  sentenceType = undefined,
  issp = undefined,
  hdc = undefined,
  pilot = undefined,
  typeOfAcquistiveCrime = undefined,
  policeForceArea = undefined,
  prarr = undefined,
  monitoringStartDate = undefined,
  monitoringEndDate = undefined,
  monitoringCondition = undefined,
}): void {
  // Order type page
  if (orderType) {
    const orderTypePage = Page.verifyOnPage(OrderTypePage)
    fillinSingleQuestionFormWith(orderTypePage.form, orderType)
  }

  // sentence type page
  if (sentenceType) {
    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage)
    fillinSingleQuestionFormWith(sentenceTypePage.form, sentenceType)
  }

  // HDC page
  if (hdc) {
    const hdcPage = Page.verifyOnPage(HdcPage)
    fillinSingleQuestionFormWith(hdcPage.form, hdc)
  }

  // Pilot page
  if (pilot) {
    const pilotPage = Page.verifyOnPage(PilotPage)
    fillinSingleQuestionFormWith(pilotPage.form, pilot)
  }
  // Type of Acquistive Crime
  if (typeOfAcquistiveCrime) {
    const offenceTypePage = Page.verifyOnPage(OffenceTypePage)
    fillinSingleQuestionFormWith(offenceTypePage.form, typeOfAcquistiveCrime)
  }

  // Police force area
  if (policeForceArea) {
    const policeAreaPage = Page.verifyOnPage(PoliceAreaPage)
    fillinSingleQuestionFormWith(policeAreaPage.form, policeForceArea)
  }

  // ISSP
  if (issp) {
    const isspPage = Page.verifyOnPage(IsspPage)
    fillinSingleQuestionFormWith(isspPage.form, issp)
  }

  // PRARR
  if (prarr) {
    const prarrPage = Page.verifyOnPage(PrarrPage)
    fillinSingleQuestionFormWith(prarrPage.form, prarr)
  }
  // Monitoring Dates
  if (monitoringStartDate) {
    const monitoringDatePage = Page.verifyOnPage(MonitoringDatesPage)
    monitoringDatePage.form.fillInWithInput({
      startDate: monitoringStartDate,
      endDate: monitoringEndDate,
    })
    monitoringDatePage.form.continueButton.click()
  }

  // Monitoring conditions
  if (monitoringCondition) {
    const monitoringConditionPage = Page.verifyOnPage(MonitoringTypesPage)
    fillinSingleQuestionFormWith(monitoringConditionPage.form, monitoringCondition)
  }
}
