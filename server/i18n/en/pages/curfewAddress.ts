import PostcodeLookupPageContent, {
  AddressResultPageContent,
  ConfirmAddressPageContent,
} from '../../../types/i18n/pages/postcodeLookup'

const curfewAddressPageContent: PostcodeLookupPageContent = {
  title: 'Find the curfew address',
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

export const curfewAddressResultPageContent: AddressResultPageContent = {
  title: 'Select the curfew address',
  section: 'About the device wearer',
  legend: '',
  helpText: '',
}

export const curfewAddressConfirmPageContent: ConfirmAddressPageContent = {
  title: 'Confirm the curfew address',
  section: 'About the device wearer',
  legend: '',
  helpText: '',
}

export default curfewAddressPageContent
