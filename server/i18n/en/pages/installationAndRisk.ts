import InstallationAndRiskPageContent from '../../../types/i18n/pages/installationAndRisk'

const installationAndRiskPageContent: InstallationAndRiskPageContent = {
  helpText: '',
  legend: '',
  questions: {
    mappaCaseType: {
      text: 'What is the MAPPA case type? (optional)',
    },
    mappaLevel: {
      text: 'Which level of MAPPA applies? (optional)',
    },
    offence: {
      text: 'What type of offence did the device wearer commit?',
      hint: 'If more than one offence committed, select the main offence',
    },
    offenceAdditionalDetails: {
      text: 'Any other information to be aware of about the offence committed? (optional)',
      hint: "Provide additional risk information about the device wearer's offence.",
    }
  },
  section: 'Risk information',
  title: 'Details for installation',
}

export default installationAndRiskPageContent
