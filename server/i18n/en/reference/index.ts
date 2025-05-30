import DataDictionaryVersion, { DataDictionaryVersions } from '../../../types/i18n/dataDictionaryVersion'
import ReferenceCatalog, { ReferenceCatalogDDv4, ReferenceCatalogDDv5 } from '../../../types/i18n/reference'
import alcoholMonitoringTypes from './alcoholMonitoringTypes'
import conditionTypes from './conditionTypes'
import crownCourts from './crownCourts'
import civilCountyCourts from './ddv5/civilCountyCourts'
import crownCourtsDDv5 from './ddv5/crownCourts'
import disabilitiesDDv5 from './ddv5/disabilities'
import familyCourts from './ddv5/familyCourts'
import magistratesCourtsDDv5 from './ddv5/magistratesCourts'
import militaryCourts from './ddv5/militaryCourts'
import notifyingOrganisationsDDv5 from './ddv5/notifyingOrganisations'
import pilots from './ddv5/pilots'
import prisonsDDv5 from './ddv5/prisons'
import riskCategoriesDDv5 from './ddv5/riskCategories'
import variationTypesDDv5 from './ddv5/variationTypes'
import youthCourts from './ddv5/youthCourts'
import disabilities from './disabilities'
import gender from './gender'
import magistratesCourts from './magistratesCourts'
import mappaCaseType from './mappaCaseType'
import mappaLevel from './mappaLevel'
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

const referenceCatalogDDv4: ReferenceCatalogDDv4 = {
  alcoholMonitoringTypes,
  conditionTypes,
  crownCourts,
  disabilities,
  gender,
  magistratesCourts,
  mappaCaseType,
  mappaLevel,
  notifyingOrganisations,
  offences,
  orderTypeDescriptions,
  orderTypes,
  prisons,
  probationDeliveryUnits,
  probationRegions,
  relationship,
  responsibleOrganisations,
  riskCategories,
  sentenceTypes,
  sex,
  variationTypes,
  yesNoUnknown,
  youthJusticeServiceRegions,
}

const referenceCatalogDDv5: ReferenceCatalogDDv5 = {
  alcoholMonitoringTypes,
  civilCountyCourts,
  conditionTypes,
  crownCourts: crownCourtsDDv5,
  disabilities: disabilitiesDDv5,
  familyCourts,
  gender,
  magistratesCourts: magistratesCourtsDDv5,
  mappaCaseType,
  mappaLevel,
  militaryCourts,
  notifyingOrganisations: notifyingOrganisationsDDv5,
  offences,
  orderTypeDescriptions,
  orderTypes,
  pilots,
  prisons: prisonsDDv5,
  probationRegions,
  relationship,
  responsibleOrganisations,
  riskCategories: riskCategoriesDDv5,
  sentenceTypes,
  sex,
  variationTypes: variationTypesDDv5,
  yesNoUnknown,
  youthCourts,
  youthJusticeServiceRegions,
}

const getReferenceData = (ddVersion: DataDictionaryVersion): ReferenceCatalog => {
  if (ddVersion === DataDictionaryVersions.DDv5) {
    return referenceCatalogDDv5
  }

  return referenceCatalogDDv4
}

export default getReferenceData
