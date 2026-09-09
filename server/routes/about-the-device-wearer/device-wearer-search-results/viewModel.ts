import paths from '../../../constants/paths'
import I18n from '../../../types/i18n'
import DeviceWearerSearchResultsService, { DeviceWearerSearchResultResponse } from './service'

const construct = (
  orderId: string,
  searchedIdentifier: string,
  searchResult: DeviceWearerSearchResultResponse,
  content: I18n,
  service: DeviceWearerSearchResultsService,
) => {
  const hasMatch = service.hasSearchMatch(searchResult)

  return {
    hasMatch,
    searchedIdentifier,
    fullName: searchResult.fullName,
    dateOfBirth: service.getDisplayDateOfBirth(searchResult),
    heading: hasMatch
      ? content.pages.deviceWearerSearchResults.titleFound
      : content.pages.deviceWearerSearchResults.titleNoResults,
    searchAgainLink: paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', orderId),
    enterDetailsManuallyLink: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
  }
}

export default { construct }
