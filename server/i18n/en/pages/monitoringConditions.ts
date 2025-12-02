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
      hint: 'Select one, if you need to you will be able to add other monitoring types later',
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
      hint: 'The acquisitive crime offence needs to be their longest or equal longest sentence.',
    },
    policeArea: {
      text: "Which police force area is the device wearer's release address in?",
      hint: 'Enter the full postcode of the device wearer release address in the <a href="https://www.police.uk/pu/find-a-police-force/" id="police-force-link" target="_blank" rel="noopener noreferrer" class="govuk-link">police force lookup (opens in a new tab)</a> to find the area.',
    },
    removeMonitoringType: {
      text: 'Are you sure that you want to delete this electronic monitoring type?',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Monitoring details',
}

export default monitoringConditionsPageContent
