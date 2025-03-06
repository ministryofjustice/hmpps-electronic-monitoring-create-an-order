import MonitoringConditionsPageContent from '../../../types/i18n/pages/monitoringConditions'

const monitoringConditionsPageContent: MonitoringConditionsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    conditionType: {
      text: 'What are the order type conditions?',
    },
    endDate: {
      text: 'What is the date when all monitoring ends? (optional)',
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
    },
    orderType: {
      text: 'What is the order type?',
    },
    orderTypeDescription: {
      text: 'What pilot project is the device wearer part of? (optional)',
    },
    prarr: {
      text: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
    },
    sentenceType: {
      text: 'What type of sentence has the device wearer been given? (optional)',
    },
    startDate: {
      text: 'What is the date for the first day of all monitoring?',
      hint: 'For example, 21 5 2029. If more than one type of monitoring is required, provide the start date of when the first type of monitoring begins.',
    },
    startTime: {
      text: 'What is the start time on the first day of monitoring?',
      hint: 'Enter time using a 24 hour clock. For example 14:30 instead of 2.30pm',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Monitoring details',
}

export default monitoringConditionsPageContent
