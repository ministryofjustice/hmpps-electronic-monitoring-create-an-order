import I18n from '../../types/i18n'
import DataDictionaryVersion from '../../types/i18n/dataDictionaryVersion'
import alcoholPageContent from './pages/alcohol'
import attendancePageContent from './pages/attendance'
import contactDetailsPageContent from './pages/contactDetails'
import curfewConditionsPageContent from './pages/curfewConditions'
import curfewReleaseDatePageContent from './pages/curfewReleaseDate'
import curfewTimeTablePageContent from './pages/curfewTimetable'
import deviceWearerPageContent from './pages/deviceWearer'
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
import getReferenceData from './reference'

const getEnglishContent = (ddVersion: DataDictionaryVersion): I18n => {
  return {
    pages: {
      alcohol: alcoholPageContent,
      attendance: attendancePageContent,
      contactDetails: contactDetailsPageContent,
      curfewConditions: curfewConditionsPageContent,
      curfewReleaseDate: curfewReleaseDatePageContent,
      curfewTimetable: curfewTimeTablePageContent,
      deviceWearer: deviceWearerPageContent,
      exclusionZone: exclusionZonePageContent,
      identityNumbers: identityNumbersPageContent,
      installationAddress: installationAddressPageContent,
      installationAndRisk: installationAndRiskPageContent,
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
      variationDetails: variationDetailsPageContent,
      probationDeliveryUnit: probationDeliveryUnitPageContent,
      installationLocation: installationLocationPageContent,
    },
    reference: getReferenceData(ddVersion),
  }
}

export default getEnglishContent
