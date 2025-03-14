import z from 'zod'

const EnforcementZoneFormDataModel = z.object({
  action: z.string(),
  description: z.string().default(''),
  duration: z.string().default(''),
  endDay: z.string().default(''),
  endMonth: z.string().default(''),
  endYear: z.string().default(''),
  startDay: z.string().default(''),
  startMonth: z.string().default(''),
  startYear: z.string().default(''),
  zoneType: z.string().nullable().default(null),
  anotherZone: z.string().default(''),
})

type EnforcementZoneFormData = Omit<z.infer<typeof EnforcementZoneFormDataModel>, 'action'>

export default EnforcementZoneFormDataModel

export { EnforcementZoneFormData }
