import OtherRisksPage from '../../e2e/order/access-needs-installation-risk/other-risks/OtherRisksPage'
import RiskAtAddressPage from '../../e2e/order/access-needs-installation-risk/risk-at-address/RiskAtAddressPage'
import RiskBehaviourPage from '../../e2e/order/access-needs-installation-risk/risk-behaviour/RiskBehaviourPage'
import Page from '../../pages/page'

export default function fillInRiskAtInstallationWith({
  possibleRisk,
  riskCategory,
  genderRiskDetails,
  otherRisks,
}: {
  possibleRisk: string
  riskCategory: string
  genderRiskDetails?: string
  otherRisks?: string
}): void {
  const riskBehaviourPage = Page.verifyOnPage(RiskBehaviourPage)
  riskBehaviourPage.form.fillInWith(possibleRisk, genderRiskDetails)
  riskBehaviourPage.form.continueButton.click()

  const riskAtAddressPage = Page.verifyOnPage(RiskAtAddressPage)
  riskAtAddressPage.form.fillInWith(riskCategory)
  riskAtAddressPage.form.continueButton.click()

  const otherRisksPage = Page.verifyOnPage(OtherRisksPage)
  otherRisksPage.form.fillInWith(otherRisks ? 'Yes' : 'No', otherRisks)
  otherRisksPage.form.continueButton.click()
}
