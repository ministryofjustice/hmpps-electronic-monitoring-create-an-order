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
    riskCategory: {
      text: 'At installation what are the possible risks? (optional)',
      hint: "Risks relate to the device wearer's behaviour and installation address. Select all that apply",
    },
    riskDetails: {
      text: 'Any other risks to be aware of? (optional)',
      hint: "Provide additional risk information about the device wearer's behaviour or the installation address.",
    },
  },
  section: 'Details for installation',
  title: 'Risk information',
}

export default installationAndRiskPageContent
