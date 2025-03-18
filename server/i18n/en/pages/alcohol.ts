import AlcoholPageContent from '../../../types/i18n/pages/alcohol'

const alcoholPageContent: AlcoholPageContent = {
  helpText: '',
  legend: '',
  questions: {
    endDate: {
      text: 'What date does alcohol monitoring end?',
      hint: 'For example, 21 05 2011',
    },
    installationLocation: {
      text: 'What is the address of the base station?',
      hint: 'The device wearer must attend the base station address at a certain time every day to send over data.',
    },
    monitoringType: {
      text: 'What alcohol monitoring does the device wearer need?',
      hint: 'Select one option',
    },
    prisonName: {
      text: 'Enter prison name',
    },
    probationOfficeName: {
      text: 'Enter probation office name',
    },
    startDate: {
      text: 'What date does alcohol monitoring start?',
      hint: 'For example, 21 05 2011',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Alcohol monitoring',
}

export default alcoholPageContent
