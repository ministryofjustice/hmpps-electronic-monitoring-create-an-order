import ReferenceData from './reference'

type RiskCategories = ReferenceData<
  | 'DANGEROUS_ANIMALS'
  | 'DIVERSITY_CONCERNS'
  | 'HISTORY_OF_SUBSTANCE_ABUSE'
  | 'IOM'
  | 'OTHER_OCCUPANTS'
  | 'OTHER_RISKS'
  | 'SAFEGUARDING_ISSUE'
  | 'UNDER_18'
>

type RiskCategoriesDDv5 = ReferenceData<
  | 'DANGEROUS_ANIMALS'
  | 'DIVERSITY_CONCERNS'
  | 'HISTORY_OF_SUBSTANCE_ABUSE'
  | 'IOM'
  | 'OTHER_OCCUPANTS'
  | 'OTHER_RISKS'
  | 'SAFEGUARDING_ADULT'
  | 'SAFEGUARDING_CHILD'
  | 'SAFEGUARDING_DOMESTIC_ABUSE'
  | 'UNDER_18'
>

export default RiskCategories

export { RiskCategoriesDDv5 }
