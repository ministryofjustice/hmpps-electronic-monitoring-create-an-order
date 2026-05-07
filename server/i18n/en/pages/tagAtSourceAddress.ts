import PostcodeLookupPageContent, {
  AddressResultPageContent,
  ConfirmAddressPageContent,
} from '../../../types/i18n/pages/postcodeLookup'

const tagAtSourceAddressPageContent: PostcodeLookupPageContent = {
  title: 'Find the installation address',
  section: 'Electronic monitoring required',
  legend: '',
  helpText:
    'For installation at source this is the address of the prison, probation office or immigration removal centre.',
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

export const tagAtSourceAddressResultPageContent: AddressResultPageContent = {
  title: 'Select the installation address',
  section: 'Electronic monitoring required',
  legend: '',
  helpText: '',
}

export const tagAtSourceAddressConfirmPageContent: ConfirmAddressPageContent = {
  title: 'Confirm the installation address',
  section: 'Electronic monitoring required',
  legend: '',
  helpText: '',
}

export default tagAtSourceAddressPageContent
