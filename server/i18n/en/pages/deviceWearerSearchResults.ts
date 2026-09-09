import DeviceWearerSearchResultsPageContent from '../../../types/i18n/pages/deviceWearerSearchResults'

const deviceWearerSearchResultsPageContent: DeviceWearerSearchResultsPageContent = {
  section: 'About the device wearer',
  titleFound: "Confirm the device wearer's details",
  titleNoResults: 'No results found',
  messages: {
    oneResultFound: '1 device wearer found for <b>{identifier}</b>.',
    noResultsFound:
      'We could not find a device wearer that matches <b>{identifier}</b>. You can search again or enter their details manually.',
  },
  links: {
    searchAgain: 'Search again',
    enterDetailsManually: 'Enter details manually',
  },
  buttons: {
    useThisDeviceWearer: 'Use this device wearer',
  },
}

export default deviceWearerSearchResultsPageContent
