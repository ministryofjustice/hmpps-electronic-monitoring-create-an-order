import { z } from 'zod'

export const CohortEnum = z.enum(['PRISON', 'PROBATION', 'COURT', 'HOME_OFFICE', 'OTHER'])
const UserCohortModel = z.object({
  cohort: CohortEnum,
  activeCaseLoad: z.string().nullable().optional(),
})

export type UserCohort = z.infer<typeof UserCohortModel>

export default UserCohortModel
