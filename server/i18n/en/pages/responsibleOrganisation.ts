import ResponsibleOrganisationPageContent from '../../../types/i18n/pages/responsibleOrganisation'

const responsibleOrganisationPageContent: ResponsibleOrganisationPageContent = {
  helpText: '',
  legend: '',
  questions: {
    police: {
      text: 'Select the Police force area',
    },
    probationRegion: {
      text: 'Select the Probation region',
    },
    responsibleOrganisation: {
      text: "What is the Responsible Officer's organisation?",
      hint: 'The Responsible Organisation is the service the Responsible Officer is part of. For example, the Responsible Organisation for a probation officer is the Probation Service.',
    },
    responsibleOrganisationEmail: {
      text: "What is the Responsible Organisation's email address? (optional)",
      hint: 'Provide an email address that can be used to contact the Responsible Organisation if the Responsible Officer is unavailable. Provide a functional mailbox not a personal email.',
    },
    yjsRegion: {
      text: 'Select the Youth Justice Service region',
    },
  },
  section: 'About the Notifying and Responsible Organisation',
  title: 'Responsible Organisation',
}

export default responsibleOrganisationPageContent
