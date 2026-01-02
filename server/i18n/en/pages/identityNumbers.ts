import IdentityNumbersPageContent from '../../../types/i18n/pages/identityNumbers'

const identityNumbersPageContent: IdentityNumbersPageContent = {
  helpText: 'Select and enter all identity numbers that you have for the device wearer.',
  legend: 'What identity numbers do you have for the device wearer?',
  questions: {
    pncId: {
      text: 'Police National Computer (PNC)',
      hint: 'Enter PNC',
    },
    nomisId: {
      text: 'National Offender Management Information System (NOMIS)',
      hint: 'Enter NOMIS',
    },
    prisonNumber: {
      text: 'Prison number',
      hint: 'Enter prison number',
    },
    deliusId: {
      text: 'NDelius ID',
      hint: 'Enter NDelius ID',
    },
    complianceAndEnforcementPersonReference: {
      text: 'Compliance and Enforcement Person Reference (CEPR)',
      hint: 'Enter CEPR',
    },
    courtCaseReferenceNumber: {
      text: 'Court Case Reference Number (CCRN)',
      hint: 'Enter CCRN',
    },
  },
  section: 'About the device wearer',
  title: 'Identity numbers',
}

export default identityNumbersPageContent
