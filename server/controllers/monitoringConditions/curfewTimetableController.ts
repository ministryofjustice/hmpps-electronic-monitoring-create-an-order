import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewTimetable } from '../../models/CurfewTimetable'
import { isValidationListResult, ValidationErrorModel } from '../../models/Validation'
import { MultipleChoiceField, TimeSpanField } from '../../models/view-models/utils'
import { AuditService, CurfewTimetableService } from '../../services'
import { deserialiseTime, getError, getErrors, serialiseTime } from '../../utils/utils'
import nextPage, { getSelectedMonitoringTypes } from './nextPage'

const timetableForm = z.object({
  timeStartHours: z.string(),
  timeStartMinutes: z.string(),
  timeEndHours: z.string(),
  timeEndMinutes: z.string(),
  addresses: z.array(z.string()).default([]),
})
const timetable = z.object({
  monday: z.array(timetableForm),
  tuesday: z.array(timetableForm),
  wednesday: z.array(timetableForm),
  thursday: z.array(timetableForm),
  friday: z.array(timetableForm),
  saturday: z.array(timetableForm),
  sunday: z.array(timetableForm),
})
const curfewTimetableFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewTimetable: timetable,
})

type CurfewTimetableFormDataItem = z.infer<typeof timetableForm>

type CurfewTimetableFormData = z.infer<typeof curfewTimetableFormDataModel>

type Timetable = {
  timeSpan: TimeSpanField
  addresses: MultipleChoiceField
}
const curfewTimetableApiDto = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  curfewAddress: z.string(),
  errors: z.array(ValidationErrorModel),
})
type CurfewTimetableApiDto = z.infer<typeof curfewTimetableApiDto>
type CurfewTimetableViewModel = {
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

export default class CurfewTimetableController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewTimetableService: CurfewTimetableService,
  ) {}

  private constructViewModel(
    curfewTimetable: CurfewTimetable | undefined,
    curefewTimetableApiDto: CurfewTimetableApiDto[],
    formData: [CurfewTimetableFormData],
  ): CurfewTimetableViewModel {
    if (formData?.length > 0) {
      return this.createViewModelFromFormData(formData[0])
    }

    if (!curefewTimetableApiDto || curefewTimetableApiDto.length === 0) {
      const curfewTimetableAsApiDto =
        curfewTimetable?.map(item => {
          return {
            ...item,
            errors: [],
          }
        }) ?? []
      return this.createViewModelFromApiDto(curfewTimetableAsApiDto)
    }
    return this.createViewModelFromApiDto(curefewTimetableApiDto)
  }

  private createViewModelFromApiDto(validationErrors: CurfewTimetableApiDto[]): CurfewTimetableViewModel {
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
    }
  }

  private createViewModelFromFormData(formData: CurfewTimetableFormData): CurfewTimetableViewModel {
    const getTimetablesForDay = (day: string, timetables: CurfewTimetableFormDataItem[]): Timetable[] =>
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
    }
  }

  private createApiModelFromFormData(formData: CurfewTimetableFormData, orderId: string): CurfewTimetable {
    return Object.entries(formData.curfewTimetable).flatMap(([day, timetables]) =>
      timetables.map(t => ({
        dayOfWeek: day.toUpperCase(),
        orderId,
        curfewAddress: t.addresses.join(','),
        startTime: serialiseTime(t.timeStartHours, t.timeStartMinutes) || '',
        endTime: serialiseTime(t.timeEndHours, t.timeEndMinutes) || '',
      })),
    )
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewTimeTable: curfewTimetable } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(curfewTimetable, errors as never, formData as never)
    res.render(`pages/order/monitoring-conditions/curfew-timetable`, viewModel)
  }

  private addTimeToCurfewDay(req: Request, res: Response, formData: CurfewTimetableFormData, orderId: string) {
    const day = formData.action.split('-').pop()!
    const curfewDay = formData.curfewTimetable[day as keyof typeof formData.curfewTimetable]

    curfewDay.push({
      timeStartHours: '',
      timeStartMinutes: '',
      timeEndHours: '',
      timeEndMinutes: '',
      addresses: [],
    })
    req.flash('formData', formData)
    res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
  }

  private removeTimeToCurfewDay(req: Request, res: Response, formData: CurfewTimetableFormData, orderId: string) {
    const action = formData.action.split('-')
    const day = action[2]
    const index = Number.parseInt(action[3], 10)
    const curfewDay = formData.curfewTimetable[day as keyof typeof formData.curfewTimetable]

    curfewDay.splice(index, 1)
    req.flash('formData', formData)
    res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const formData = curfewTimetableFormDataModel.parse(req.body)
    if (formData.action.startsWith('add-time-')) {
      this.addTimeToCurfewDay(req, res, formData, orderId)
    } else if (formData.action.startsWith('remove-time-')) {
      this.removeTimeToCurfewDay(req, res, formData, orderId)
    } else {
      const apiModel = this.createApiModelFromFormData(formData, orderId)
      const updateResult = await this.curfewTimetableService.update({
        accessToken: res.locals.user.token,
        orderId,
        data: apiModel,
      })

      if (isValidationListResult(updateResult)) {
        const validationResult = apiModel.map((item, index) => {
          return {
            ...item,
            errors: updateResult.filter(it => it.index === index).at(0)?.errors ?? [],
          }
        })
        req.flash('validationErrors', validationResult)

        res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
      } else {
        const { monitoringConditions } = req.order!
        res.redirect(nextPage(getSelectedMonitoringTypes(monitoringConditions), 'curfew').replace(':orderId', orderId))
      }
    }
  }
}
