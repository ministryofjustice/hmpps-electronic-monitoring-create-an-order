import AddressListPage from '../../e2e/order/postcode-lookup/address-list/addressListPage'
import AddressResultPage from '../../e2e/order/postcode-lookup/address-result/addressResultPage'
import ConfirmAddressPage from '../../e2e/order/postcode-lookup/confirm-address/confirmAddressPage'
import EnterAddressPage from '../../e2e/order/postcode-lookup/enter-address/enterAddressPage'
import FindAddressPage from '../../e2e/order/postcode-lookup/find-address/findAddressPage'
import Page from '../../pages/page'

export default function fillinAddress({ findAddress }) {
  const findAddressPage = Page.verifyOnPage(FindAddressPage)
  findAddressPage.form.fillInWith(findAddress)
  findAddressPage.form.continueButton.click()

  if (findAddress === 'Search') {
    const addressResultPage = Page.verifyOnPage(AddressResultPage)
    addressResultPage.form.continueButton.click()
  } else if (findAddress === 'Manual') {
    const enterAddressPage = Page.verifyOnPage(EnterAddressPage)
    enterAddressPage.form.continueButton.click()
  }

  const confirmAddressPage = Page.verifyOnPage(ConfirmAddressPage)
  confirmAddressPage.form.continueButton.click()

  const addressListPage = Page.verifyOnPage(AddressListPage)
  addressListPage.form.continueButton.click()
}
