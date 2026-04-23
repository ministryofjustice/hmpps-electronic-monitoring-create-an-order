import AddressListPage from '../../e2e/order/postcode-lookup/address-list/addressListPage'
import AddressResultPage from '../../e2e/order/postcode-lookup/address-result/addressResultPage'
import ConfirmAddressPage from '../../e2e/order/postcode-lookup/confirm-address/confirmAddressPage'
import EnterAddressPage from '../../e2e/order/postcode-lookup/enter-address/enterAddressPage'
import FindAddressPage from '../../e2e/order/postcode-lookup/find-address/findAddressPage'
import Page from '../../pages/page'

export default function fillinAddress({ findAddress, addressResult, enterAddress }) {
  const findAddressPage = Page.verifyOnPage(FindAddressPage)
  if (findAddress.postcode) {
    findAddressPage.form.fillInWith(findAddress)
    findAddressPage.form.findAddressButton.click()
  } else {
    findAddressPage.form.manualAddressLink.click()
  }

  if (findAddress.postcode) {
    const addressResultPage = Page.verifyOnPage(AddressResultPage)
    addressResultPage.form.fillInWith(addressResult.address)
    addressResultPage.form.useAddressButton.click()
  } else {
    const enterAddressPage = Page.verifyOnPage(EnterAddressPage)
    enterAddressPage.form.fillInWith(enterAddress)
    enterAddressPage.form.continueButton.click()
  }

  const confirmAddressPage = Page.verifyOnPage(ConfirmAddressPage)
  confirmAddressPage.form.continueButton.click()

  const addressListPage = Page.verifyOnPage(AddressListPage)
  addressListPage.form.continueButton.click()
}
