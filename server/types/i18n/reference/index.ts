import Gender from './gender'
import MappaCaseType from './mappaCaseType'
import MappaLevel from './mappaLevel'
import Offences from './offences'
import RiskCategories from './riskCategories'
import Sex from './sex'

type ReferenceCatalog = {
  gender: Gender
  mappaCaseType: MappaCaseType
  mappaLevel: MappaLevel
  offences: Offences
  riskCategories: RiskCategories
  sex: Sex
}

export default ReferenceCatalog
