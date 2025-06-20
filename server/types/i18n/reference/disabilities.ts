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
  | 'NONE'
>

type DisabilitiesDDv5 = ReferenceData<
  | 'VISION'
  | 'HEARING'
  | 'MOBILITY'
  | 'DEXTERITY'
  | 'LEARNING_UNDERSTANDING_OR_CONCENTRATING'
  | 'MEMORY'
  | 'MENTAL_HEALTH'
  | 'STAMINA_OR_BREATHING_OR_FATIGUE'
  | 'SOCIALLY_OR_BEHAVIORALLY'
  | 'SKIN_CONDITION'
  | 'OTHER'
  | 'NONE_OF_THE_ABOVE'
>

export default Disabilities

export { DisabilitiesDDv5 }
