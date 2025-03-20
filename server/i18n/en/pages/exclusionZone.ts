import ExclusionZonePageContent from '../../../types/i18n/pages/exclusionZone'

const exclusionZonePageContent: ExclusionZonePageContent = {
  helpText: '',
  legend: '',
  questions: {
    anotherZone: {
      text: 'Do you need to add another exclusion zone?',
      hint: 'For example another zone the device wearer is restricted from entering.',
    },
    description: {
      text: 'Where is the exclusion zone?',
      hint: 'Enter a description of the zone and include additional information that will help us understand its restrictions. For example include door numbers, building names or landmarks that pinpoint where the zone starts and ends.',
    },
    duration: {
      text: 'When must the exclusion zone be followed?',
      hint: 'For example, On Monday to Friday between 08:00 to 17:00 every week',
    },
    endDate: {
      text: 'What date does exclusion zone monitoring end? (optional)',
      hint: 'For example, 21 05 2011',
    },
    file: {
      text: 'Upload map',
    },
    startDate: {
      text: 'What date does exclusion zone monitoring start?',
      hint: 'For example, 21 05 2011',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Exclusion zone monitoring',
}

export default exclusionZonePageContent
