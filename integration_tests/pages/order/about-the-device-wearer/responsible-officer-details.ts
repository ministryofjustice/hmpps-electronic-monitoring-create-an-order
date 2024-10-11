import AppPage from '../../appPage'

import ResponsibleOfficerFormComponent from '../../components/deviceWearer/responsibleOfficerForm'

export default class ResponsibleOfficerPage extends AppPage {
  form: ResponsibleOfficerFormComponent

  constructor() {
    super('About the device wearer', 'Responsible officer / responsible organisation details')
    this.form = new ResponsibleOfficerFormComponent()
  }
}
