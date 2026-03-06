import PostcodeLookupPageContent from '../../../types/i18n/pages/postcodeLookup'

const tagAtSourceAddressPageContent: PostcodeLookupPageContent = {
  title: 'Find the installation address',
  section: 'Electronic monitoring required',
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

export default tagAtSourceAddressPageContent
