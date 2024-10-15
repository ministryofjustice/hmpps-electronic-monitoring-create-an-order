import { z } from 'zod'

const CurfewReleaseDateModel = z.object({
  address: z.string().nullable(),
  releaseDate: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
})

export type CurfewReleaseDate = z.infer<typeof CurfewReleaseDateModel>

export default CurfewReleaseDateModel
