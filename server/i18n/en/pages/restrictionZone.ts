import EnforcementZonePageContent from '../../../types/i18n/pages/enforcementZone'

const restrictionZonePageContent: EnforcementZonePageContent = {
  helpText: '',
  legend: '',
  questions: {
    anotherZone: {
      text: 'Do you need to add another restriction zone?',
      hint: 'For example another zone the device wearer is restricted from entering.',
    },
    description: {
      text: 'Where is the restriction zone?',
      hint: 'Enter a description of the zone and include additional information that will help us understand its restrictions. For example include door numbers, building names or landmarks that pinpoint where the zone starts and ends.',
    },
    duration: {
      text: 'When must the restriction zone be followed?',
      hint: 'For example, On Monday to Friday between 08:00 to 17:00 every week',
    },
    endDate: {
      text: 'What date does restriction zone monitoring end?',
      hint: 'For example, 21 05 2025',
    },
    name: {
      text: 'What name would you give to the restriction zone?',
      hint: "For example, Partner's house",
    },
    file: {
      text: 'Monitoring zone map (optional)',
      hint: 'Upload a map to show us where the restriction zone is.',
    },
    startDate: {
      text: 'What date does restriction zone monitoring start?',
      hint: 'For example, 21 05 2025',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Restriction zone monitoring',
}

export default restrictionZonePageContent
