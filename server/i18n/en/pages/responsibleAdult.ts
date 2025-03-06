import ResponsibleAdultPageContent from '../../../types/i18n/pages/responsibleAdult'

const responsibleAdultPageContent: ResponsibleAdultPageContent = {
  helpText:
    'A responsible adult is a parent, legal guardian or someone with parental rights. A responsible adult must attend installation of the electronic monitoring devices.',
  legend: '',
  questions: {
    contactNumber: {
      text: "What is the responsible adult's telephone number? (optional)",
    },
    fullName: {
      text: "What is the responsible adult's full name?",
    },
    otherRelationship: {
      text: 'Relationship to device wearer',
    },
    relationship: {
      text: "What is the responsible adult's relationship to the device wearer?",
    },
  },
  section: 'About the device wearer',
  title: 'Responsible adult details',
}

export default responsibleAdultPageContent
