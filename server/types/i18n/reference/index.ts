import AlcoholMonitoringTypes from './alcoholMonitoringTypes'
import CivilCountyCourts from './civilCountyCourts'
import ConditionTypes from './conditionTypes'
import CrownCourts, { CrownCourtsDDv5 } from './crownCourts'
import Disabilities, { DisabilitiesDDv5 } from './disabilities'
import FamilyCourts from './familyCourts'
import Gender from './gender'
import MagistratesCourts, { MagistratesCourtsDDv5 } from './magistratesCourts'
import MappaCaseType from './mappaCaseType'
import MappaLevel from './mappaLevel'
import MilitaryCourts from './militaryCourts'
import NotifyingOrganisations, { NotifyingOrganisationsDDv5 } from './notifyingOrganisations'
import Offences from './offences'
import OrderTypeDescriptions from './orderTypeDescriptions'
import OrderTypes from './orderTypes'
import Pilots from './pilots'
import Prisons, { PrisonsDDv5 } from './prisons'
import ProbationDeliveryUnits from './probationDeliveryUnits'
import ProbationRegions from './probationRegions'
import Relationship from './relationship'
import ResponsibleOrganisations from './responsibleOrganisations'
import RiskCategories, { RiskCategoriesDDv5 } from './riskCategories'
import SentenceTypes from './sentenceTypes'
import Sex from './sex'
import VariationTypes, { VariationTypesDDv5 } from './variationTypes'
import YesNoUnknown from './yesNoUnknown'
import YouthCourts from './youthCourts'
import YouthJusticeServiceRegions from './youthJusticeServiceRegions'

type ReferenceCatalogDDv4 = {
  alcoholMonitoringTypes: AlcoholMonitoringTypes
  conditionTypes: ConditionTypes
  crownCourts: CrownCourts
  disabilities: Disabilities
  gender: Gender
  magistratesCourts: MagistratesCourts
  mappaCaseType: MappaCaseType
  mappaLevel: MappaLevel
  notifyingOrganisations: NotifyingOrganisations
  offences: Offences
  orderTypeDescriptions: OrderTypeDescriptions
  orderTypes: OrderTypes
  prisons: Prisons
  probationRegions: ProbationRegions
  relationship: Relationship
  responsibleOrganisations: ResponsibleOrganisations
  riskCategories: RiskCategories
  sentenceTypes: SentenceTypes
  sex: Sex
  variationTypes: VariationTypes
  yesNoUnknown: YesNoUnknown
  youthJusticeServiceRegions: YouthJusticeServiceRegions
}

type ReferenceCatalogDDv5 = {
  alcoholMonitoringTypes: AlcoholMonitoringTypes
  civilCountyCourts: CivilCountyCourts
  conditionTypes: ConditionTypes
  crownCourts: CrownCourtsDDv5
  disabilities: DisabilitiesDDv5
  familyCourts: FamilyCourts
  gender: Gender
  magistratesCourts: MagistratesCourtsDDv5
  mappaCaseType: MappaCaseType
  mappaLevel: MappaLevel
  militaryCourts: MilitaryCourts
  notifyingOrganisations: NotifyingOrganisationsDDv5
  offences: Offences
  orderTypeDescriptions: OrderTypeDescriptions
  orderTypes: OrderTypes
  pilots: Pilots
  prisons: PrisonsDDv5
  probationRegions: ProbationRegions
    probationDeliveryUnits: ProbationDeliveryUnits
  relationship: Relationship
  responsibleOrganisations: ResponsibleOrganisations
  riskCategories: RiskCategoriesDDv5
  sentenceTypes: SentenceTypes
  sex: Sex
  variationTypes: VariationTypesDDv5
  yesNoUnknown: YesNoUnknown
  youthCourts: YouthCourts
  youthJusticeServiceRegions: YouthJusticeServiceRegions
}

type ReferenceCatalog = ReferenceCatalogDDv4 | ReferenceCatalogDDv5

export default ReferenceCatalog
