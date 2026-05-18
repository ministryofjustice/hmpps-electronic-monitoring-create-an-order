import OrderNotifyingOrganisationPage from '../../pages/order/notifying-organisation'
import OrderTasksPage from '../../pages/order/summary'
import Page from '../../pages/page'

export default function fillInOrderNotifyingOrganisation(notifyingOrganisation = null): OrderTasksPage {
  const page = Page.verifyOnPage(OrderNotifyingOrganisationPage)

  page.form.fillInWith(
    notifyingOrganisation || {
      notifyingOrganisation: 'Prison service',
      prison: 'Altcourse Prison',
      notifyingOrganisationEmailAddress: 'notifying-org@example.com',
    },
  )
  page.form.continueButton.click()

  return Page.verifyOnPage(OrderTasksPage)
}
