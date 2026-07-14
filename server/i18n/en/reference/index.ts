import DataDictionaryVersion from '../../../types/i18n/dataDictionaryVersion'
import ReferenceCatalog, {
  ReferenceCatalogDDv4,
  ReferenceCatalogDDv5,
  ReferenceCatalogDDv6,
  ReferenceCatalogDDv7,
} from '../../../types/i18n/reference'
import alcoholMonitoringTypes from './alcoholMonitoringTypes'
import deviceTypes from './deviceTypes'
import conditionTypes from './conditionTypes'
import crownCourts from './crownCourts'
import civilCountyCourts from './ddv5/civilCountyCourts'
import crownCourtsDDv5 from './ddv5/crownCourts'
import disabilitiesDDv5 from './ddv5/disabilities'
import familyCourts from './ddv5/familyCourts'
import magistratesCourtsDDv5 from './ddv5/magistratesCourts'
import militaryCourts from './ddv5/militaryCourts'
import notifyingOrganisationsDDv5 from './ddv5/notifyingOrganisations'
import pilotsDDv5 from './ddv5/pilots'
import prisonsDDv5 from './ddv5/prisons'
import riskCategoriesDDv5 from './ddv5/riskCategories'
import variationTypesDDv5 from './ddv5/variationTypes'
import youthCourts from './ddv5/youthCourts'
import disabilities from './disabilities'
import gender from './gender'
import languages from './languages'
import magistratesCourts from './magistratesCourts'
import mappaCategory from './mappaCategory'
import mappaLevel from './mappaLevel'
import isMappa from './isMappa'
import notifyingOrganisations from './notifyingOrganisations'
import offences from './offences'
import orderTypeDescriptions from './orderTypeDescriptions'
import orderTypes from './orderTypes'
import prisons from './prisons'
import probationDeliveryUnits from './probationDeliveryUnits'
import probationRegions from './probationRegions'
import relationship from './responsibleAdult'
import responsibleOrganisations from './responsibleOrganisations'
import riskCategories from './riskCategories'
import sentenceTypes from './sentenceTypes'
import sex from './sex'
import variationTypes from './variationTypes'
import yesNoUnknown from './yesNoUnknown'
import youthJusticeServiceRegions from './youthJusticeServiceRegions'
import probationRegionDeliveryUnits from './probationRegionDeliveryUnits'
import installationLocations from './installationLocations'
import possibleRisks from './possibleRisks'
import pilots from './pilots'
import policeAreas from './policeAreas'
import policeAreasDDv6 from './ddv6/policeAreas'
import serviceRequestTypes from './serviceRequestTypes'
import probationDeliveryUnitsDDv6 from './ddv6/probationDeliveryUnits'
import probationRegionDeliveryUnitsDDv6 from './ddv6/probationRegionDeliveryUnits'
import youthCustodyServiceRegions from './ddv5/youthCustodyServiceRegions'
import youthCustodyServiceRegionsDDv6 from './ddv6/youthCustodyServiceRegions'
import notifyingOrganisationsDDv6 from './ddv6/notifyingOrganisations'
import probationDeliveryUnitsDDv7 from './ddv7/probationDeliveryUnits'
import probationRegionDeliveryUnitsDDv7 from './ddv7/probationRegionDeliveryUnits'

const referenceCatalogDDv4: ReferenceCatalogDDv4 = {
  alcoholMonitoringTypes,
  deviceTypes,
  conditionTypes,
  crownCourts,
  disabilities,
  gender,
  languages,
  magistratesCourts,
  mappaCategory,
  mappaLevel,
  isMappa,
  notifyingOrganisations,
  offences,
  orderTypeDescriptions,
  orderTypes,
  pilots,
  prisons,
  probationRegions,
  relationship,
  responsibleOrganisations,
  riskCategories,
  sentenceTypes,
  sex,
  variationTypes,
  yesNoUnknown,
  youthJusticeServiceRegions,
  installationLocations,
  possibleRisks,
  policeAreas,
  releaseAddressPoliceAreas: policeAreas,
  serviceRequestTypes,
  youthCustodyServiceRegions,
}

const referenceCatalogDDv5: ReferenceCatalogDDv5 = {
  ...referenceCatalogDDv4,
  civilCountyCourts,
  crownCourts: crownCourtsDDv5,
  disabilities: disabilitiesDDv5,
  familyCourts,
  magistratesCourts: magistratesCourtsDDv5,
  militaryCourts,
  notifyingOrganisations: notifyingOrganisationsDDv5,
  pilots: pilotsDDv5,
  prisons: prisonsDDv5,
  probationDeliveryUnits,
  riskCategories: riskCategoriesDDv5,
  variationTypes: variationTypesDDv5,
  youthCourts,
  probationRegionDeliveryUnits,
}

const referenceCatalogDDv6: ReferenceCatalogDDv6 = {
  ...referenceCatalogDDv5,
  notifyingOrganisations: notifyingOrganisationsDDv6,
  probationDeliveryUnits: probationDeliveryUnitsDDv6,
  probationRegionDeliveryUnits: probationRegionDeliveryUnitsDDv6,
  policeAreas: policeAreasDDv6,
  youthCustodyServiceRegions: youthCustodyServiceRegionsDDv6,
}

const referenceCatalogDDv7: ReferenceCatalogDDv7 = {
  ...referenceCatalogDDv6,
  probationDeliveryUnits: probationDeliveryUnitsDDv7,
  probationRegionDeliveryUnits: probationRegionDeliveryUnitsDDv7,
}

const getReferenceData = (ddVersion: DataDictionaryVersion): ReferenceCatalog => {
  switch (ddVersion) {
    case 'DDV4':
      return referenceCatalogDDv4
    case 'DDV5':
      return referenceCatalogDDv5
    case 'DDV6':
      return referenceCatalogDDv6
    case 'DDV7':
      return referenceCatalogDDv7
    default: {
      throw new Error(`Unknown data dictionary version: ${ddVersion}`)
    }
  }
}

export default getReferenceData
