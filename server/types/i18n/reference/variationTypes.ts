import ReferenceData from './reference'

type VariationTypes = ReferenceData<
  'CURFEW_HOURS' | 'ADDRESS' | 'ENFORCEMENT_ADD' | 'ENFORCEMENT_UPDATE' | 'SUSPENSION'
>

type VariationTypesDDv5 = ReferenceData<
  | 'CHANGE_TO_ADDRESS'
  | 'CHANGE_TO_PERSONAL_DETAILS'
  | 'CHANGE_TO_ADD_AN_INCLUSION_OR_EXCLUSION_ZONES'
  | 'CHANGE_TO_AN_EXISTING_INCLUSION_OR_EXCLUSION'
  | 'CHANGE_TO_CURFEW_HOURS'
  | 'ORDER_SUSPENSION'
  | 'CHANGE_TO_DEVICE_TYPE'
  | 'CHANGE_TO_ENFORCEABLE_CONDITION'
  | 'ADMIN_ERROR'
  | 'OTHER'
>

export default VariationTypes

export type { VariationTypesDDv5 }
