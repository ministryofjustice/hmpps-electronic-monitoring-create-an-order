import MonitoringConditionsPageContent from '../../../types/i18n/pages/monitoringConditions'

const monitoringConditionsPageContent: MonitoringConditionsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    endDate: {
      text: 'What is the date when all monitoring ends?',
      hint: 'For example, 21 5 2029. If more than one type of monitoring is required, provide the date when all monitoring finishes.',
    },
    endTime: {
      text: 'What is the end time on the last day of monitoring? (optional)',
      hint: 'Enter time using a 24 hour clock. For example 14:30 instead of 2.30pm',
    },
    hdc: {
      text: 'Is the device wearer on a Home Detention Curfew (HDC)?',
    },
    issp: {
      text: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
      hint: 'ISSP is for device wearers between the ages of 10-17',
    },
    monitoringRequired: {
      text: 'What monitoring does the device wearer need?',
      hint: 'Select all that apply.',
    },
    orderType: {
      text: 'What is the order type?',
    },
    orderTypeDescription: {
      text: 'What pilot project is the device wearer part of?',
      hint: 'This is on Create and Vary a Licence (CVL) on the page you print the licence',
    },
    pilot: {
      text: 'What pilot project is the device wearer part of?',
      hint: 'This is on Create and Vary a Licence (CVL) on the page you print the licence',
    },
    prarr: {
      text: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
    },
    sentenceType: {
      text: 'What type of sentence has the device wearer been given?',
    },
    startDate: {
      text: 'What is the date for the first day of all monitoring?',
      hint: 'For example, 21 5 2029. If more than one type of monitoring is required, provide the start date of when the first type of monitoring begins.',
    },
    startTime: {
      text: 'What is the start time on the first day of monitoring?',
      hint: 'Enter time using a 24 hour clock. For example 14:30 instead of 2.30pm',
    },
    offenceType: {
      text: 'What type of acquisitive crime offence did the device wearer commit?',
      hint: 'To be eligible for the acquisitive crime pilot the device wearer must have committed an acquisitive offence. It needs to be their longest or equal longest sentence.',
    },
    policeArea: {
      text: "Which police force area is the device wearer's release address in?",
      hint: 'To be eligible for the acquisitive crime pilot the device wearer\'s release address must be in an in-scope police area. Use the <a href="https://www.police.uk/pu/your-area/" id="police-area-link" target="_blank" rel="noopener noreferrer" class="govuk-link">police force lookup (opens in a new tab)</a> to check which police force area the device wearer release address is in.',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Monitoring details',
}

export default monitoringConditionsPageContent
