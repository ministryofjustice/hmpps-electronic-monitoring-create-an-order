import AddressPageContent from './pages/address'
import AlcoholPageContent from './pages/alcohol'
import AttendancePageContent from './pages/attendance'
import ConfirmationPageContent from './pages/confirmationPage'
import ContactDetailsPageContent from './pages/contactDetails'
import CurfewAdditionalDetailsPageContent from './pages/curfewAdditionalDetails'
import CurfewConditionsPageContent from './pages/curfewConditions'
import CurfewReleaseDatePageContent from './pages/curfewReleaseDate'
import CurfewTimeTablePageContent from './pages/curfewTimeTable'
import DeviceWearerPageContent from './pages/deviceWearer'
import ExclusionZonePageContent from './pages/exclusionZone'
import HavePhotoPageContent from './pages/havePhoto'
import IdentityNumbersPageContent from './pages/identityNumbers'
import InstallationAndRiskPageContent from './pages/installationAndRisk'
import InstallationAppointmentPageContent from './pages/installationAppointment'
import InstallationLocationPageContent from './pages/installationLocation'
import InterestedPartiesPageContent from './pages/interestedParties'
import ProbationDeliveryUnit from './pages/probationDeliveryUnit'
import MonitoringConditionsPageContent from './pages/monitoringConditions'
import NoFixedAbodePageContent from './pages/noFixedAbode'
import ResponsibleAdultPageContent from './pages/responsibleAdult'
import TrailMonitoringPageContent from './pages/trailMonitoring'
import UploadDocumentPageContent from './pages/uploadDocument'
import VariationDetailsPageContent from './pages/variationDetails'
import ReferenceData from './reference'
import IsRejectionPageContent from './pages/isRejection'
import ServiceRequestTypePageContent from './pages/serviceRequestType'

type I18n = {
  pages: {
    alcohol: AlcoholPageContent
    attendance: AttendancePageContent
    contactDetails: ContactDetailsPageContent
    curfewConditions: CurfewConditionsPageContent
    curfewAdditionalDetails: CurfewAdditionalDetailsPageContent
    curfewReleaseDate: CurfewReleaseDatePageContent
    curfewTimetable: CurfewTimeTablePageContent
    deleteConfirm: ConfirmationPageContent
    deviceWearer: DeviceWearerPageContent
    editConfirm: ConfirmationPageContent
    exclusionZone: ExclusionZonePageContent
    havePhoto: HavePhotoPageContent
    identityNumbers: IdentityNumbersPageContent
    installationAddress: AddressPageContent
    installationAndRisk: InstallationAndRiskPageContent
    installationAppointment: InstallationAppointmentPageContent
    installationLocation: InstallationLocationPageContent
    interestedParties: InterestedPartiesPageContent
    probationDeliveryUnit: ProbationDeliveryUnit
    monitoringConditions: MonitoringConditionsPageContent
    noFixedAbode: NoFixedAbodePageContent
    primaryAddress: AddressPageContent
    responsibleAdult: ResponsibleAdultPageContent
    secondaryAddress: AddressPageContent
    tertiaryAddress: AddressPageContent
    trailMonitoring: TrailMonitoringPageContent
    uploadLicense: UploadDocumentPageContent
    uploadPhotoId: UploadDocumentPageContent
    variationDetails: VariationDetailsPageContent
    isRejection: IsRejectionPageContent
    serviceRequestType: ServiceRequestTypePageContent
  }
  reference: ReferenceData
}

export default I18n
