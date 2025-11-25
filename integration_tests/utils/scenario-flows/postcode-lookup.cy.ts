import AddressResultPage from '../../e2e/order/postcode-lookup/address-result/AddressResultPage'
import FindAddressPage from '../../e2e/order/postcode-lookup/find-address/FindAddressPage'
import Page from '../../pages/page'

export default function fillinAddress({ findAddress }) {
  const findAddressPage = Page.verifyOnPage(FindAddressPage)
  findAddressPage.form.fillInWith(findAddress)
  findAddressPage.form.continueButton.click()

  if (findAddress === 'Search') {
    const addressResultPage = Page.verifyOnPage(AddressResultPage)
    addressResultPage.form.continueButton.click()
  }
}
