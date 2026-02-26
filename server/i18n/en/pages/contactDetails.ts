import ContactDetailsPageContent from '../../../types/i18n/pages/contactDetails'

const contactDetailsPageContent: ContactDetailsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    contactNumber: {
      text: "What is the device wearer's telephone number?",
      hint: 'Enter a mobile telephone number or a landline phone number including the area code',
    },
    phoneNumberAvailable: {
      text: 'Does the device wearer have a contact telephone number?',
      hint: 'The contact number can be the number of an Approved Premises (AP).',
    },
  },

  section: 'Contact information',
  title: 'Does the device wearer have a contact telephone number?',
}

export default contactDetailsPageContent
