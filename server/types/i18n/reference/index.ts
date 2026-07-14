import AlcoholMonitoringTypes from './alcoholMonitoringTypes'
import CivilCountyCourts from './civilCountyCourts'
import ConditionTypes from './conditionTypes'
import CrownCourts, { CrownCourtsDDv5 } from './crownCourts'
import Disabilities, { DisabilitiesDDv5 } from './disabilities'
import FamilyCourts from './familyCourts'
import Gender from './gender'
import Languages from './languages'
import MagistratesCourts, { MagistratesCourtsDDv5 } from './magistratesCourts'
import MappaCategory from './mappaCategory'
import MappaLevel from './mappaLevel'
import IsMappa from './isMappa'
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
import ProbationRegionDeliveryUnits from './probationRegionDeliveryUnits'
import InstallationLocations from './installationLocations'
import PossibleRisks from './possibleRisks'
import PoliceAreas from './policeAreas'
import ServiceRequestTypes from './serviceRequestTypes'
import ProbationDeliveryUnitsDDv6 from './ddv6/probationDeliveryUnits'
import DeviceTypes from './deviceTypes'
import YouthCustodyServiceRegions from './youthCustodyServiceRegions'
import YouthCustodyServiceRegionsDDv6 from './ddv6/youthCustodyServiceRegions'
import PoliceAreasDDv6 from './ddv6/policeAreas'
import ProbationDeliveryUnitsDDv7 from './ddv7/probationDeliveryUnits'
import { Override } from '../../utils'

type ReferenceCatalogDDv4 = {
  alcoholMonitoringTypes: AlcoholMonitoringTypes
  conditionTypes: ConditionTypes
  crownCourts: CrownCourts
  disabilities: Disabilities
  gender: Gender
  languages: Languages
  magistratesCourts: MagistratesCourts
  mappaCategory: MappaCategory
  mappaLevel: MappaLevel
  isMappa: IsMappa
  notifyingOrganisations: NotifyingOrganisations
  offences: Offences
  orderTypeDescriptions: OrderTypeDescriptions
  orderTypes: OrderTypes
  prisons: Prisons
  pilots: Pilots
  probationRegions: ProbationRegions
  relationship: Relationship
  responsibleOrganisations: ResponsibleOrganisations
  riskCategories: RiskCategories
  sentenceTypes: SentenceTypes
  sex: Sex
  variationTypes: VariationTypes
  yesNoUnknown: YesNoUnknown
  youthJusticeServiceRegions: YouthJusticeServiceRegions
  installationLocations: InstallationLocations
  possibleRisks: PossibleRisks
  policeAreas: PoliceAreas
  releaseAddressPoliceAreas: PoliceAreas
  serviceRequestTypes: ServiceRequestTypes
  deviceTypes: DeviceTypes
  youthCustodyServiceRegions: YouthCustodyServiceRegions
}

type ReferenceCatalogDDv5 = Override<
  ReferenceCatalogDDv4,
  {
    civilCountyCourts: CivilCountyCourts
    crownCourts: CrownCourtsDDv5
    disabilities: DisabilitiesDDv5
    familyCourts: FamilyCourts
    magistratesCourts: MagistratesCourtsDDv5
    militaryCourts: MilitaryCourts
    notifyingOrganisations: NotifyingOrganisationsDDv5
    prisons: PrisonsDDv5
    probationDeliveryUnits: ProbationDeliveryUnits
    probationRegionDeliveryUnits: ProbationRegionDeliveryUnits
    riskCategories: RiskCategoriesDDv5
    variationTypes: VariationTypesDDv5
    youthCourts: YouthCourts
  }
>

type ReferenceCatalogDDv6 = Override<
  ReferenceCatalogDDv5,
  {
    probationDeliveryUnits: ProbationDeliveryUnitsDDv6
    policeAreas: PoliceAreasDDv6
    youthCustodyServiceRegions: YouthCustodyServiceRegionsDDv6
  }
>

type ReferenceCatalogDDv7 = Override<
  ReferenceCatalogDDv6,
  {
    probationDeliveryUnits: ProbationDeliveryUnitsDDv7
  }
>

type ReferenceCatalog = ReferenceCatalogDDv4 | ReferenceCatalogDDv5 | ReferenceCatalogDDv6 | ReferenceCatalogDDv7

export default ReferenceCatalog

export { ReferenceCatalogDDv4, ReferenceCatalogDDv5, ReferenceCatalogDDv6, ReferenceCatalogDDv7 }
