import { z } from 'zod'

export const DisabilityEnum = z.enum([
  'VISION',
  'HEARING',
  'MOBILITY',
  'DEXTERITY',
  'SKIN_CONDITION',
  'LEARNING_UNDERSTANDING_CONCENTRATING',
  'MEMORY',
  'MENTAL_HEALTH',
  'STAMINA_BREATHING_FATIGUE',
  'SOCIAL_BEHAVIOURAL',
  'OTHER',
  'NO_LISTED_CONDITION',
  'NONE',
  'PREFER_NOT_TO_SAY',
])

export const IdentityNumbersEnum = z.enum([
  'NOMIS',
  'PNC',
  'DELIUS',
  'PRISON_NUMBER',
  'HOME_OFFICE',
  'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE',
  'COURT_CASE_REFERENCE_NUMBER',
])

export const SexEnum = z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY', 'UNKNOWN'])

const DeviceWearerModel = z.object({
  nomisId: z.string().nullable(),
  pncId: z.string().nullable(),
  deliusId: z.string().nullable(),
  prisonNumber: z.string().nullable(),
  homeOfficeReferenceNumber: z.string().nullable(),
  complianceAndEnforcementPersonReference: z.string().nullable(),
  courtCaseReferenceNumber: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().datetime().nullable(),
  adultAtTimeOfInstallation: z.boolean().nullable(),
  sex: SexEnum.nullable(),
  gender: z.string().nullable(),
  disabilities: z
    .string()
    .nullable()
    .transform(disabilities => {
      if (disabilities === null || disabilities === '') {
        return []
      }
      return disabilities.split(',')
    })
    .pipe(z.array(DisabilityEnum)),
  otherDisability: z.string().nullable().optional(),
  noFixedAbode: z.boolean().nullable(),
  language: z.string().nullable().optional(),
  interpreterRequired: z.boolean().nullable(),
})

export type DeviceWearer = z.infer<typeof DeviceWearerModel>
export type Disability = z.infer<typeof DisabilityEnum>
export type IdentityNumberType = z.infer<typeof IdentityNumbersEnum>

export default DeviceWearerModel
