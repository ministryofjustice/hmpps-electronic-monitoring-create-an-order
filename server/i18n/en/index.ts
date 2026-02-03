import I18n from '../../types/i18n'
import DataDictionaryVersion from '../../types/i18n/dataDictionaryVersion'
import alcoholPageContent from './pages/alcohol'
import attendancePageContent from './pages/attendance'
import contactDetailsPageContent from './pages/contactDetails'
import curfewConditionsPageContent from './pages/curfewConditions'
import curfewAdditionalDetailsPageContent from './pages/curfewAdditionalDetails'
import curfewReleaseDatePageContent from './pages/curfewReleaseDate'
import curfewTimeTablePageContent from './pages/curfewTimetable'
import deleteConfirmPageContent from './pages/deleteConfirm'
import deviceWearerPageContent from './pages/deviceWearer'
import editConfirmPageContent from './pages/editConfirm'
import exclusionZonePageContent from './pages/exclusionZone'
import identityNumbersPageContent from './pages/identityNumbers'
import installationAddressPageContent from './pages/installationAddress'
import installationAndRiskPageContent from './pages/installationAndRisk'
import interestedPartiesPageContent from './pages/interestedParties'
import monitoringConditionsPageContent from './pages/monitoringConditions'
import noFixedAbodePageContent from './pages/noFixedAbode'
import primaryAddressPageContent from './pages/primaryAddress'
import responsibleAdultPageContent from './pages/responsibleAdult'
import secondaryAddressPageContent from './pages/secondaryAddress'
import tertiaryAddressPageContent from './pages/tertiaryAddress'
import trailMonitoringPageContent from './pages/trailMonitoring'
import uploadLicencePageContent from './pages/uploadLicence'
import uploadPhotoIdPageContent from './pages/uploadPhotoId'
import variationDetailsPageContent from './pages/variationDetails'
import probationDeliveryUnitPageContent from './pages/probationDeliveryUnit'
import installationLocationPageContent from './pages/installationLocation'
import installationAppointmentPageContent from './pages/installationAppointment'
import getReferenceData from './reference'
import havePhotoPageContent from './pages/havePhoto'
import isRejectionPageContent from './pages/isRejection'
import serviceRequestTypePageContent from './pages/serviceRequestType'
import haveCourtOrderPageContent from './pages/haveCourtOrder'
import uploadCourtOrderPageContent from './pages/uploadCourtOrder'
import uploadGrantOfBailPageContent from './pages/uploadGrantOfBail'
import haveGrantOfBailPageContent from './pages/haveGrantOfBail'
import dapoContent from './pages/dapo'
import offenceContent from './pages/offence'
import mappaPageContent from './pages/mappa'
import detailsOfInstallationPageContent from './pages/details-of-installation'
import offenceOtherInformationPageContent from './pages/offenceOtherInformation'

const getEnglishContent = (ddVersion: DataDictionaryVersion): I18n => {
  return {
    pages: {
      alcohol: alcoholPageContent,
      attendance: attendancePageContent,
      contactDetails: contactDetailsPageContent,
      curfewConditions: curfewConditionsPageContent,
      curfewAdditionalDetails: curfewAdditionalDetailsPageContent,
      curfewReleaseDate: curfewReleaseDatePageContent,
      curfewTimetable: curfewTimeTablePageContent,
      deleteConfirm: deleteConfirmPageContent,
      deviceWearer: deviceWearerPageContent,
      editConfirm: editConfirmPageContent,
      exclusionZone: exclusionZonePageContent,
      identityNumbers: identityNumbersPageContent,
      installationAddress: installationAddressPageContent,
      installationAndRisk: installationAndRiskPageContent,
      detailsOfInstallation: detailsOfInstallationPageContent,
      interestedParties: interestedPartiesPageContent,
      monitoringConditions: monitoringConditionsPageContent,
      noFixedAbode: noFixedAbodePageContent,
      primaryAddress: primaryAddressPageContent,
      responsibleAdult: responsibleAdultPageContent,
      secondaryAddress: secondaryAddressPageContent,
      tertiaryAddress: tertiaryAddressPageContent,
      trailMonitoring: trailMonitoringPageContent,
      uploadLicense: uploadLicencePageContent,
      uploadPhotoId: uploadPhotoIdPageContent,
      uploadCourtOrder: uploadCourtOrderPageContent,
      uploadGrantOfBail: uploadGrantOfBailPageContent,
      havePhoto: havePhotoPageContent,
      haveCourtOrder: haveCourtOrderPageContent,
      haveGrantOfBail: haveGrantOfBailPageContent,
      variationDetails: variationDetailsPageContent,
      probationDeliveryUnit: probationDeliveryUnitPageContent,
      installationLocation: installationLocationPageContent,
      installationAppointment: installationAppointmentPageContent,
      isRejection: isRejectionPageContent,
      serviceRequestType: serviceRequestTypePageContent,
      dapo: dapoContent,
      offence: offenceContent,
      mappa: mappaPageContent,
      offenceOtherInformation: offenceOtherInformationPageContent,
    },
    reference: getReferenceData(ddVersion),
  }
}

export default getEnglishContent
