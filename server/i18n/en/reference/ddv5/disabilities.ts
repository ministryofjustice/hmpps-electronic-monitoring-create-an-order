import { DisabilitiesDDv5 } from '../../../../types/i18n/reference/disabilities'

const disabilitiesDDv5: DisabilitiesDDv5 = {
  VISION: 'Visual impairment or blindness not corrected by wearing glasses',
  HEARING: 'Deafness or serious hearing impairment',
  MOBILITY: {
    text: 'Physical disability or mobility issue',
    description: 'For example, impaired use of arms or legs, use of a wheelchair or crutches',
  },
  DEXTERITY: {
    text: 'Fine motor or dexterity impairment',
    description: "For example, dyspraxia or neurological conditions such as Parkinson's disease",
  },
  SKIN_CONDITION: {
    text: 'Skin condition',
    description: 'For example, acne, eczema, psoriasis, or skin infections',
  },
  LEARNING_UNDERSTANDING_CONCENTRATING: {
    text: 'Neurodiversity including conditions affecting learning, understanding or concentration',
    description: 'For example, dyslexia or attention deficit hyperactivity disorder (ADHD)',
  },
  MEMORY: {
    text: 'Condition affecting the memory or retaining information',
    description: "For example, Dementia, Alzheimer's disease or amnesia",
  },
  MENTAL_HEALTH: {
    text: 'Mental health condition',
    description: 'For example, depression, psychosis, schizophrenia or any anxiety disorder',
  },
  STAMINA_BREATHING_FATIGUE: {
    text: 'Health condition affecting stamina, breathing or causing fatigue',
    description:
      'For example, Heart conditions or lung conditions such as chronic obstructive pulmonary disease (COPD)',
  },
  SOCIAL_BEHAVIOURAL: {
    text: 'Conditions affecting social skills and behaviour',
    description: 'For example, Autism Spectrum Disorder (ASD)',
  },
  OTHER: 'The device wearer has a disability or health condition not listed',
  NO_LISTED_CONDITION: 'The device wearer does not have any of the disabilities or health conditions listed',
  NONE: 'Not able to provide this information',
}

export default disabilitiesDDv5
