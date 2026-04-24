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
import HaveCourtOrderPageContent from './pages/haveCourtOrder'
import DapoContent from './pages/dapo'
import OffenceContent from './pages/offence'
import MappaPageContent from './pages/mappa'
import DetailsOfInstallationPageContent from './pages/detailsOfInstallation'
import OffenceOtherInformationPageContent from './pages/offenceOtherInformation'
import IsMappaPageContent from './pages/isMappa'
import OffenceListPageContent from './pages/offenceListPage'
import DapoClauseListPageConent from './pages/dapoClauseListPage'
import NotifyingOrganisationPageContent from './pages/notifyingOrganisation'
import ResponsibleOrganisationPageContent from './pages/responsibleOrganisation'
import ResponsibleOfficerPageContent from './pages/responsibleOfficer'
import PostcodeLookupPageContent, { AddressResultPageContent, ConfirmAddressPageContent } from './pages/postcodeLookup'
import NationalSecurityDirectoratePageConetent from './pages/national-security-directorate'
import IsAddressChangePageContent from './pages/isAddressChange'
import AddressListContent from './pages/addressList'

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
    haveCourtOrder: HaveCourtOrderPageContent
    identityNumbers: IdentityNumbersPageContent
    installationAddress: AddressPageContent
    installationAndRisk: InstallationAndRiskPageContent
    installationAppointment: InstallationAppointmentPageContent
    installationLocation: InstallationLocationPageContent
    detailsOfInstallation: DetailsOfInstallationPageContent
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
    uploadCourtOrder: UploadDocumentPageContent
    variationDetails: VariationDetailsPageContent
    isRejection: IsRejectionPageContent
    serviceRequestType: ServiceRequestTypePageContent
    dapo: DapoContent
    offence: OffenceContent
    mappa: MappaPageContent
    offenceOtherInformation: OffenceOtherInformationPageContent
    isMappa: IsMappaPageContent
    offenceList: OffenceListPageContent
    dapoClauseList: DapoClauseListPageConent
    notifyingOrganisation: NotifyingOrganisationPageContent
    responsibleOrganisation: ResponsibleOrganisationPageContent
    responsibleOfficer: ResponsibleOfficerPageContent
    pdu: ProbationDeliveryUnit
    deviceWearerAddress: PostcodeLookupPageContent
    deviceWearerAddressResult: AddressResultPageContent
    deviceWearerAddressConfirm: ConfirmAddressPageContent
    tagAtSourceAddress: PostcodeLookupPageContent
    tagAtSourceAddressResult: AddressResultPageContent
    tagAtSourceAddressConfirm: ConfirmAddressPageContent
    curfewAddress: PostcodeLookupPageContent
    curfewAddressResult: AddressResultPageContent
    curfewAddressConfirm: ConfirmAddressPageContent
    appointmentAddress: PostcodeLookupPageContent
    appointmentAddressConfirm: ConfirmAddressPageContent
    nationalSecurityDirectorate: NationalSecurityDirectoratePageConetent
    isAddressChange: IsAddressChangePageContent
    addressList: AddressListContent
  }
  reference: ReferenceData
}

export default I18n
