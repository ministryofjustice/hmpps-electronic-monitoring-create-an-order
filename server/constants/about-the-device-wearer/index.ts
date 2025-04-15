const disabilitiesMap: Record<string, string> = {
  VISION: 'Vision',
  HEARING: 'Hearing',
  MOBILITY: 'Mobility',
  DEXTERITY: 'Dexterity',
  LEARNING_UNDERSTANDING_CONCENTRATING: 'Learning or understanding or concentrating',
  MEMORY: 'Memory',
  MENTAL_HEALTH: 'Mental health',
  STAMINA_BREATHING_FATIGUE: 'Stamina or breathing or fatigue',
  SOCIAL_BEHAVIOURAL: 'Socially or behaviorally',
  OTHER: 'Other',
  NONE: 'None of the above',
  PREFER_NOT_TO_SAY: 'Prefer Not to Say',
}

const genderMap: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  'non-binary': 'Non binary',
  unknown: 'Not able to provide this information',
  'self-identify': 'Self identify',
}

export { disabilitiesMap, genderMap }
