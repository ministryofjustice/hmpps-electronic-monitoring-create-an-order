import AlcoholMonitoringTypes from './alcoholMonitoringTypes'
import ConditionTypes from './conditionTypes'
import Disabilities from './disabilities'
import Gender from './gender'
import MappaCaseType from './mappaCaseType'
import MappaLevel from './mappaLevel'
import Offences from './offences'
import OrderTypeDescriptions from './orderTypeDescriptions'
import OrderTypes from './orderTypes'
import Relationship from './relationship'
import RiskCategories from './riskCategories'
import Sex from './sex'
import VariationTypes from './variationTypes'

type ReferenceCatalog = {
  alcoholMonitoringTypes: AlcoholMonitoringTypes
  conditionTypes: ConditionTypes
  disabilities: Disabilities
  gender: Gender
  mappaCaseType: MappaCaseType
  mappaLevel: MappaLevel
  offences: Offences
  orderTypeDescriptions: OrderTypeDescriptions
  orderTypes: OrderTypes
  relationship: Relationship
  riskCategories: RiskCategories
  sex: Sex
  variationTypes: VariationTypes
}

export default ReferenceCatalog
