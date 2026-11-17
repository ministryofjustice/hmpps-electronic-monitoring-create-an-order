import AppFormPage from '../../appFormPage'
import paths from '../../../../server/constants/paths'
import AdultAtInstallationFormComponent, {
  RESPONSIBLE_ADULT_QUESTION,
} from '../../components/forms/about-the-device-wearer/adultAtInstallationForm'

export { RESPONSIBLE_ADULT_QUESTION }

export default class AdultAtInstallationPage extends AppFormPage {
  public form = new AdultAtInstallationFormComponent()

  constructor() {
    super(RESPONSIBLE_ADULT_QUESTION, paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION, 'About the device wearer')
  }
}
