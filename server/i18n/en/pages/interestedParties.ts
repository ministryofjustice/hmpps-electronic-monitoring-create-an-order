import InterestedPartiesPageContent from '../../../types/i18n/pages/interestedParties'

const interestedPartiesPageContent: InterestedPartiesPageContent = {
  helpText: '',
  legend: '',
  questions: {
    crownCourt: {
      text: 'Select the name of the Crown Court',
    },
    magistratesCourt: {
      text: 'Select the name of the Court',
    },
    notifyingOrganisation: {
      text: 'What organisation or related organisation are you part of?',
    },
    notifyingOrganisationEmail: {
      text: "What is your team's contact email address?",
      hint: "Provide the email address for a mailbox that member's of your team can access. Do not provide a personal email address.",
    },
    prison: {
      text: 'Select the name of the Prison',
    },
    probationRegion: {
      text: 'Select the Probation region',
    },
    responsibleOfficerName: {
      text: "What is the Responsible Officer's full name?",
      hint: 'Include first name and surname',
    },
    responsibleOfficerPhoneNumber: {
      text: "What is the Responsible Officer's telephone number?",
    },
    responsibleOrganisation: {
      text: "What is the Responsible Officer's organisation?",
      hint: 'The Responsible Organisation is the service the Responsible Officer is part of. For example, the Responsible Organisation for a probation officer is the Probation Service.',
    },
    responsibleOrganisationEmail: {
      text: "What is the Responsible Organisation's email address? (optional)",
      hint: 'Provide an email address that can be used to contact the Responsible Organisation if the Responsible Officer is unavaliable. Provide a functional mailbox not a personal email.',
    },
    yjsRegion: {
      text: 'Select the Youth Justice Service region',
    },
  },
  section: 'Contact information',
  title: 'Organisation details',
}

export default interestedPartiesPageContent
