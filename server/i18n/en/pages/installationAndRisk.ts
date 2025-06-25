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
      text: 'What type of offence did the device wearer commit? (optional)',
      hint: 'If more than one offence commented, select the main offence',
    },
    offenceAdditionalDetails: {
      text: 'Any other information to be aware of about the offence committed? (optional)',
      hint: "Provide additional risk information about the device wearer's offence",
    },
    possibleRisk: {
      text: "At installation what are the possible risks from the device wearer's behaviour?",
      hint: 'Check if there are any alerts for the device wearer. Select all that apply',
    },
    riskCategory: {
      text: 'At installation what are the possible risks at the insallation address? (optional)',
      hint: "Risks relate to the device wearer's behaviour and installation address. Select all that apply",
    },
    riskDetails: {
      text: 'Any other risks to be aware of? (optional)',
      hint: "Provide additional risk information about the device wearer's behaviour or the installation address.",
    },
  },
  section: 'Risk information',
  title: 'Details for installation',
}

export default installationAndRiskPageContent
