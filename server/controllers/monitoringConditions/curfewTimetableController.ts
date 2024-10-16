import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewTimetable } from '../../models/CurfewTimetable'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { MultipleChoiceField, TimeSpanField } from '../../models/view-models/utils'
import { AuditService, CurfewTimetableService } from '../../services'
import { deserialiseTime, getError, getErrors, serialiseTime } from '../../utils/utils'

const timetableForm = z.object({
  timeStartHours: z.string(),
  timeStartMinutes: z.string(),
  timeEndHours: z.string(),
  timeEndMinutes: z.string(),
  addresses: z.array(z.string()),
})

const curfewTimetableFormDataModel = z.object({
  action: z.string().default('continue'),
  curfewTimetable: z.object({
    monday: z.array(timetableForm),
    tuesday: z.array(timetableForm),
    wednesday: z.array(timetableForm),
    thursday: z.array(timetableForm),
    friday: z.array(timetableForm),
    saturday: z.array(timetableForm),
    sunday: z.array(timetableForm),
  }),
})

type CurfewTimetableFormDataItem = z.infer<typeof timetableForm>

type CurfewTimetableFormData = z.infer<typeof curfewTimetableFormDataModel>

type Timetable = {
  timeSpan: TimeSpanField
  addresses: MultipleChoiceField
}

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
    validationErrors: ValidationResult,
    formData: [CurfewTimetableFormData],
  ): CurfewTimetableViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromCurfewTimetable(curfewTimetable)
  }

  private createViewModelFromCurfewTimetable(curfewTimetable?: CurfewTimetable): CurfewTimetableViewModel {
    const getTimetablesForDay = (day: string, timetables?: CurfewTimetable): Timetable[] =>
      timetables
        ?.filter(t => t.day === day)
        .map(t => {
          const [startHours, startMinutes] = deserialiseTime(t.startTime)
          const [endHours, endMinutes] = deserialiseTime(t.endTime)
          return {
            timeSpan: { value: { startHours, startMinutes, endHours, endMinutes } },
            addresses: { values: t.addresses },
          }
        }) ?? []

    return {
      curfewTimetable: {
        monday: getTimetablesForDay('monday', curfewTimetable),
        tuesday: getTimetablesForDay('tuesday', curfewTimetable),
        wednesday: getTimetablesForDay('wednesday', curfewTimetable),
        thursday: getTimetablesForDay('thursday', curfewTimetable),
        friday: getTimetablesForDay('friday', curfewTimetable),
        saturday: getTimetablesForDay('saturday', curfewTimetable),
        sunday: getTimetablesForDay('sunday', curfewTimetable),
      },
    }
  }

  private createViewModelFromFormData(
    formData: CurfewTimetableFormData,
    validationErrors: ValidationResult,
  ): CurfewTimetableViewModel {
    const getTimetablesForDay = (day: string, timetables: CurfewTimetableFormDataItem[]): Timetable[] =>
      timetables.map((t, index) => {
        return {
          timeSpan: {
            value: {
              startHours: t.timeStartHours,
              startMinutes: t.timeStartMinutes,
              endHours: t.timeEndHours,
              endMinutes: t.timeEndMinutes,
            },
            error: getErrors(validationErrors, [`${day}[${index}].startTime`, `${day}[${index}].endTime`]),
          },
          addresses: { values: t.addresses, error: getError(validationErrors, `${day}[${index}].addresses`) },
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

  private createApiModelFromFormData(formData: CurfewTimetableFormData): CurfewTimetable {
    return Object.entries(formData.curfewTimetable).flatMap(([day, timetables]) =>
      timetables.map(timetable => ({
        day,
        addresses: timetable.addresses,
        startTime: serialiseTime(timetable.timeStartHours, timetable.timeStartMinutes) || '',
        endTime: serialiseTime(timetable.timeEndHours, timetable.timeEndMinutes) || '',
      })),
    )
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { monitoringConditionsCurfewTimetable: timetable } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    const viewModel = this.constructViewModel(timetable, errors as never, formData as never)
    res.render(`pages/order/monitoring-conditions/curfew-timetable`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const formData = curfewTimetableFormDataModel.parse(req.body)

    const updateResult = await this.curfewTimetableService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
