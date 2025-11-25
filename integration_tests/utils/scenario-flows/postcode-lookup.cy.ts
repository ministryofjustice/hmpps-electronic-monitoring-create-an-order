import FindAddressPage from '../../e2e/order/postcode-lookup/find-address/FindAddressPage'
import Page from '../../pages/page'

export default function fillinAddress({ findAddress }) {
  const findAddressPage = Page.verifyOnPage(FindAddressPage)
  findAddressPage.form.fillInWith(findAddress)
  findAddressPage.form.continueButton.click()
}
