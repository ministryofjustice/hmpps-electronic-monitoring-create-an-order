import { z } from 'zod'

const CurfewDayOfReleaseModel = z.object({})

export type CurfewDayOfRelease = z.infer<typeof CurfewDayOfReleaseModel>

export default CurfewDayOfReleaseModel
