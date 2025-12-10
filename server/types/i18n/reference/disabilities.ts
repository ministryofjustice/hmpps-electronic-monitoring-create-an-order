import ReferenceData from './reference'

type Disabilities = ReferenceData<
  | 'VISION'
  | 'HEARING'
  | 'MOBILITY'
  | 'DEXTERITY'
  | 'LEARNING_UNDERSTANDING_CONCENTRATING'
  | 'MEMORY'
  | 'MENTAL_HEALTH'
  | 'STAMINA_BREATHING_FATIGUE'
  | 'SOCIAL_BEHAVIOURAL'
  | 'OTHER'
  | 'NO_LISTED_CONDITION'
  | 'NONE'
>

type DisabilitiesDDv5 = ReferenceData<
  | 'VISION'
  | 'HEARING'
  | 'MOBILITY'
  | 'DEXTERITY'
  | 'LEARNING_UNDERSTANDING_CONCENTRATING'
  | 'MEMORY'
  | 'MENTAL_HEALTH'
  | 'STAMINA_BREATHING_FATIGUE'
  | 'SOCIAL_BEHAVIOURAL'
  | 'SKIN_CONDITION'
  | 'OTHER'
  | 'NO_LISTED_CONDITION'
  | 'NONE'
>

export default Disabilities

export { DisabilitiesDDv5 }
