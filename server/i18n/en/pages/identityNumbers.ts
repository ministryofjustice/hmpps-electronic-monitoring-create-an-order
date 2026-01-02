import IdentityNumbersPageContent from '../../../types/i18n/pages/identityNumbers'

const identityNumbersPageContent: IdentityNumbersPageContent = {
  helpText: 'Select and enter all identity numbers that you have for the device wearer.',
  legend: 'What identity numbers do you have for the device wearer?',
  questions: {
    deliusId: {
      text: 'NDelius ID',
    },
    homeOfficeReferenceNumber: {
      text: 'Home Office Reference Number',
    },
    nomisId: {
      text: 'National Offender Management Information System (NOMIS)',
    },
    pncId: {
      text: 'Police National Computer (PNC)',
    },
    prisonNumber: {
      text: 'Prison Number',
    },
    complianceAndEnforcementPersonReference: {
      text: 'Compliance and Enforcement Person Reference (CEPR)',
    },
    courtCaseReferenceNumber: {
      text: 'Court Case Reference Number (CCRN)',
    },
  },
  section: 'About the device wearer',
  title: 'Identity numbers',
}

export default identityNumbersPageContent
