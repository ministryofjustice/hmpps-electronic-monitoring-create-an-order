import AppFormPage from '../../appFormPage'
import paths from '../../../../server/constants/paths'
import DeviceWearerSearchResultsFormComponent from '../../components/forms/about-the-device-wearer/deviceWearerSearchResultsForm'

export default class DeviceWearerSearchResultsPage extends AppFormPage {
  form = new DeviceWearerSearchResultsFormComponent()

  constructor() {
    super(
      /Confirm the device wearer's details|No results found/,
      paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS,
      'About the device wearer',
    )
  }
}
