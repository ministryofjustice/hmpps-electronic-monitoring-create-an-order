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
      hint: "Provide additional risk information about the device wearer's offence. If the device wearer is part of the acquisitive crime pilot add details of their theft, robbery, or burglary offences.",
    },
    possibleRisk: {
      text: "At installation what are the possible risks from the device wearer's behaviour?",
      hint: 'Check if there are any alerts for the device wearer. Select all that apply',
    },
    riskCategory: {
      text: 'What are the possible risks at the installation address? (optional)',
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
