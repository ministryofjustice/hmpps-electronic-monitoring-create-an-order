import TypesOfMonitoringNeededPage from '../../e2e/order/monitoring-conditions/order-type-description/types-of-monitoring-needed/TypesOfMonitoringNeededPage'
import RemoveMonitoringTypePage from '../../e2e/order/monitoring-conditions/remove-monitoring-type/RemoveMonitoringTypePage'
import Page from '../../pages/page'

export default function removeMonitoringCondition(removeConditionDetials) {
  const page = Page.verifyOnPage(TypesOfMonitoringNeededPage)

  page.actionLinkByLabel(removeConditionDetials.conditionLable, 'Delete').click()

  const confirmDeletePage = Page.verifyOnPage(RemoveMonitoringTypePage)
  confirmDeletePage.confirmRemoveButton().click()
}
