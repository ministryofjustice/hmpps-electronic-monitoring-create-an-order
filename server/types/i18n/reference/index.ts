import Gender from './gender'
import MappaCaseType from './mappaCaseType'
import MappaLevel from './mappaLevel'
import Offences from './offences'
import Relationship from './relationship'
import RiskCategories from './riskCategories'
import Sex from './sex'

type ReferenceCatalog = {
  gender: Gender
  mappaCaseType: MappaCaseType
  mappaLevel: MappaLevel
  offences: Offences
  relationship: Relationship
  riskCategories: RiskCategories
  sex: Sex
}

export default ReferenceCatalog
