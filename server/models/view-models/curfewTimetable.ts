import { z } from 'zod'

import { deserialiseTime, getErrors, getError } from '../../utils/utils'
import { MultipleChoiceField, TimeSpanField, ViewModel } from './utils'

import { CurfewTimetable } from '../CurfewTimetable'
import { CurfewTimetableFormData, curfewTimetableFormDataItem } from '../form-data/curfewTimetable'

import { ValidationErrorModel, ValidationResult } from '../Validation'
import { createGovukErrorSummary } from '../../utils/errors'

export type Timetable = {
  timeSpan: TimeSpanField
  addresses: MultipleChoiceField
}

export type CurfewTimetableViewModel = ViewModel<unknown> & {
  curfewTimetable: {
    monday: Timetable[]
    tuesday: Timetable[]
    wednesday: Timetable[]
    thursday: Timetable[]
    friday: Timetable[]
    saturday: Timetable[]
    sunday: Timetable[]
  }
}

const curfewTimetableApiDto = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  curfewAddress: z.string(),
  errors: z.array(ValidationErrorModel),
})

type CurfewTimetableApiDto = z.infer<typeof curfewTimetableApiDto>

const createViewModelFromApiDto = (validationErrors: CurfewTimetableApiDto[]): CurfewTimetableViewModel => {
  const getTimetablesForDay = (day: string, timetables?: CurfewTimetableApiDto[]): Timetable[] =>
    timetables
      ?.filter(t => t.dayOfWeek === day)
      .map(t => {
        const [startHours, startMinutes] = deserialiseTime(t.startTime)
        const [endHours, endMinutes] = deserialiseTime(t.endTime)
        return {
          timeSpan: {
            value: { startHours, startMinutes, endHours, endMinutes },
            error: getErrors(t.errors, [`startTime`, `endTime`]),
          },
          addresses: { values: t.curfewAddress.split(','), error: getError(t.errors, `curfewAddress`) },
        }
      }) ?? []

  const allErrors = validationErrors.reduce((acc, t) => [...acc, ...t.errors], [] as ValidationResult)

  return {
    curfewTimetable: {
      monday: getTimetablesForDay('MONDAY', validationErrors),
      tuesday: getTimetablesForDay('TUESDAY', validationErrors),
      wednesday: getTimetablesForDay('WEDNESDAY', validationErrors),
      thursday: getTimetablesForDay('THURSDAY', validationErrors),
      friday: getTimetablesForDay('FRIDAY', validationErrors),
      saturday: getTimetablesForDay('SATURDAY', validationErrors),
      sunday: getTimetablesForDay('SUNDAY', validationErrors),
    },
    errorSummary: createGovukErrorSummary(allErrors),
  }
}

const createViewModelFromFormData = (formData: CurfewTimetableFormData): CurfewTimetableViewModel => {
  const getTimetablesForDay = (day: string, timetables: curfewTimetableFormDataItem[]): Timetable[] =>
    timetables.map(t => {
      return {
        timeSpan: {
          value: {
            startHours: t.timeStartHours,
            startMinutes: t.timeStartMinutes,
            endHours: t.timeEndHours,
            endMinutes: t.timeEndMinutes,
          },
        },
        addresses: { values: t.addresses },
      }
    }) ?? []

  return {
    curfewTimetable: {
      monday: getTimetablesForDay('monday', formData.curfewTimetable.monday),
      tuesday: getTimetablesForDay('tuesday', formData.curfewTimetable.tuesday),
      wednesday: getTimetablesForDay('wednesday', formData.curfewTimetable.wednesday),
      thursday: getTimetablesForDay('thursday', formData.curfewTimetable.thursday),
      friday: getTimetablesForDay('friday', formData.curfewTimetable.friday),
      saturday: getTimetablesForDay('saturday', formData.curfewTimetable.saturday),
      sunday: getTimetablesForDay('sunday', formData.curfewTimetable.sunday),
    },
    errorSummary: null,
  }
}

const construct = (
  curfewTimetable: CurfewTimetable | undefined,
  apiDto: CurfewTimetableApiDto[],
  formData: [CurfewTimetableFormData],
): CurfewTimetableViewModel => {
  if (!apiDto || apiDto.length === 0) {
    if (formData?.length > 0) {
      return createViewModelFromFormData(formData[0])
    }

    const curfewTimetableAsApiDto =
      curfewTimetable?.map(item => {
        return {
          ...item,
          errors: [],
        }
      }) ?? []
    return createViewModelFromApiDto(curfewTimetableAsApiDto)
  }

  return createViewModelFromApiDto(apiDto)
}

export default {
  construct,
}
