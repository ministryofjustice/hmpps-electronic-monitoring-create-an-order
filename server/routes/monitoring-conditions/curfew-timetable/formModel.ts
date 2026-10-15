import { z } from 'zod'

const CurfewTimetableEntryModel = z.object({
  timeStartHours: z.string(),
  timeStartMinutes: z.string(),
  timeEndHours: z.string(),
  timeEndMinutes: z.string(),
  addresses: z.array(z.string()).default([]),
})

const curfewTimetableDataModel = z.object({
  monday: z.array(CurfewTimetableEntryModel),
  tuesday: z.array(CurfewTimetableEntryModel),
  wednesday: z.array(CurfewTimetableEntryModel),
  thursday: z.array(CurfewTimetableEntryModel),
  friday: z.array(CurfewTimetableEntryModel),
  saturday: z.array(CurfewTimetableEntryModel),
  sunday: z.array(CurfewTimetableEntryModel),
})

const CurfewTimetableFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewTimetable: curfewTimetableDataModel,
})

export type curfewTimetableFormDataItem = z.infer<typeof CurfewTimetableEntryModel>
export type CurfewTimetableDataModel = z.infer<typeof curfewTimetableDataModel>
export type CurfewTimetableFormData = z.infer<typeof CurfewTimetableFormDataModel>

export default CurfewTimetableFormDataModel
