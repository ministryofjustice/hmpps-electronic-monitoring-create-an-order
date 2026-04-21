import PostcodeLookupPageContent, { AddressResultPageContent } from '../../../types/i18n/pages/postcodeLookup'

const deviceWearerAddressPageContent: PostcodeLookupPageContent = {
  title: "Find the device wearer's address",
  section: 'About the device wearer',
  legend: '',
  helpText: '',
  questions: {
    postcode: {
      text: 'Postcode',
      hint: 'For example, AA3 1AB',
    },
    buildingId: {
      text: 'Building number or name (optional)',
      hint: 'For example, 15 or Prospect Cottage',
    },
  },
}

export const deviceWearerAddressResultPageContent: AddressResultPageContent = {
  title: "Select the device wearer's address",
  section: 'About the device wearer',
  legend: '',
  helpText: '',
}

export default deviceWearerAddressPageContent
