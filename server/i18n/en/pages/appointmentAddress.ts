import PostcodeLookupPageContent, { ConfirmAddressPageContent } from '../../../types/i18n/pages/postcodeLookup'

const appointmentAddressPageContent: PostcodeLookupPageContent = {
  title: 'Find the appointment address',
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

export const appointmentAddressConfirmPageContent: ConfirmAddressPageContent = {
  title: 'Confirm the appointment address',
  section: 'Electronic monitoring required',
  legend: '',
  helpText: '',
}

export default appointmentAddressPageContent
