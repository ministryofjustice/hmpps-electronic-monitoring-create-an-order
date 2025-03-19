import AddressPageContent from './pages/address'
import AlcoholPageContent from './pages/alcohol'
import AttendancePageContent from './pages/attendance'
import ContactDetailsPageContent from './pages/contactDetails'
import CurfewConditionsPageContent from './pages/curfewConditions'
import CurfewReleaseDatePageContent from './pages/curfewReleaseDate'
import CurfewTimeTablePageContent from './pages/curfewTimeTable'
import DeviceWearerPageContent from './pages/deviceWearer'
import ExclusionZonePageContent from './pages/exclusionZone'
import IdentityNumbersPageContent from './pages/identityNumbers'
import InstallationAndRiskPageContent from './pages/installationAndRisk'
import InterestedPartiesPageContent from './pages/interestedParties'
import MonitoringConditionsPageContent from './pages/monitoringConditions'
import NoFixedAbodePageContent from './pages/noFixedAbode'
import ResponsibleAdultPageContent from './pages/responsibleAdult'
import TrailMonitoringPageContent from './pages/trailMonitoring'
import UploadDocumentPageContent from './pages/uploadDocument'
import RiskCategories from './reference/riskCategories'

type I18n = {
  pages: {
    alcohol: AlcoholPageContent
    attendance: AttendancePageContent
    contactDetails: ContactDetailsPageContent
    curfewConditions: CurfewConditionsPageContent
    curfewReleaseDate: CurfewReleaseDatePageContent
    curfewTimetable: CurfewTimeTablePageContent
    deviceWearer: DeviceWearerPageContent
    exclusionZone: ExclusionZonePageContent
    identityNumbers: IdentityNumbersPageContent
    installationAddress: AddressPageContent
    installationAndRisk: InstallationAndRiskPageContent
    interestedParties: InterestedPartiesPageContent
    monitoringConditions: MonitoringConditionsPageContent
    noFixedAbode: NoFixedAbodePageContent
    primaryAddress: AddressPageContent
    responsibleAdult: ResponsibleAdultPageContent
    secondaryAddress: AddressPageContent
    tertiaryAddress: AddressPageContent
    trailMonitoring: TrailMonitoringPageContent
    uploadLicense: UploadDocumentPageContent
    uploadPhotoId: UploadDocumentPageContent
  }
  reference: {
    riskCategories: RiskCategories
  }
}

export default I18n
