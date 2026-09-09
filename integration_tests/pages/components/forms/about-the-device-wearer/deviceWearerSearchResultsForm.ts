import FormComponent from '../../formComponent'
import { PageElement } from '../../../page'

export default class DeviceWearerSearchResultsFormComponent extends FormComponent {
  get useThisDeviceWearerButton(): PageElement {
    return this.form.contains('Use this device wearer')
  }

  get saveAsDraftButton(): PageElement {
    return this.form.contains('Save as draft')
  }

  get searchAgainLink(): PageElement {
    return this.form.contains('a', 'Search again')
  }

  get enterDetailsManuallyLink(): PageElement {
    return this.form.contains('a', 'Enter details manually')
  }
}
