import { Request, RequestHandler, Response } from 'express'

import paths from '../../constants/paths'
import { isValidationListResult } from '../../models/Validation'
import { AuditService, CurfewTimetableService } from '../../services'
import TaskListService from '../../services/taskListService'
import { CurfewTimetable } from '../../models/CurfewTimetable'
import CurfewTimetableFormDataModel, { CurfewTimetableDataModel } from '../../models/form-data/curfewTimetable'
import curfewTimetableViewModel from '../../models/view-models/curfewTimetable'
import { serialiseTime } from '../../utils/utils'

const createApiModelFromFormData = (curfewTimetable: CurfewTimetableDataModel, orderId: string): CurfewTimetable => {
  return Object.entries(curfewTimetable).flatMap(([day, timetables]) =>
    timetables.map(t => ({
      dayOfWeek: day.toUpperCase(),
      orderId,
      curfewAddress: t.addresses.join(','),
      startTime: serialiseTime(t.timeStartHours, t.timeStartMinutes) || '',
      endTime: serialiseTime(t.timeEndHours, t.timeEndMinutes) || '',
    })),
  )
}

const parseAction = (action?: string): [verb: string | undefined, options: { day: string; index: number }] => {
  if (!action) {
    return ['view', { day: '', index: 0 }]
  }

  if (action?.startsWith('add-time-')) {
    const [, , day] = action.split('-')
    return ['add-time', { day, index: 0 }]
  }

  if (action?.startsWith('remove-time-')) {
    const [, , day, indexString] = action.split('-')
    const index = Number.parseInt(indexString, 10)

    return ['remove-time', { day, index }]
  }

  return [action, { day: '', index: 0 }]
}

export default class CurfewTimetableController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewTimetableService: CurfewTimetableService,
    private readonly taskListService: TaskListService,
  ) {}

  private addTimeToCurfewDay(
    curfewTimetable: CurfewTimetableDataModel,
    options: { day: string },
  ): CurfewTimetableDataModel {
    const curfewDay = curfewTimetable[options.day as keyof CurfewTimetableDataModel]
    curfewDay.push({
      timeStartHours: '',
      timeStartMinutes: '',
      timeEndHours: '',
      timeEndMinutes: '',
      addresses: [],
    })

    return curfewTimetable
  }

  private removeTimeFromCurfewDay(
    curfewTimetable: CurfewTimetableDataModel,
    options: { day: string; index: number },
  ): CurfewTimetableDataModel {
    const curfewDay = curfewTimetable[options.day as keyof CurfewTimetableDataModel]
    curfewDay.splice(options.index, 1)

    return curfewTimetable
  }

  private copyTimeAcrossCurfewDays(curfewTimetable: CurfewTimetableDataModel): CurfewTimetableDataModel {
    const sourceDay = curfewTimetable.monday

    return {
      monday: sourceDay,
      tuesday: sourceDay,
      wednesday: sourceDay,
      thursday: sourceDay,
      friday: sourceDay,
      saturday: sourceDay,
      sunday: sourceDay,
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewTimeTable } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = curfewTimetableViewModel.construct(curfewTimeTable ?? [], errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-timetable`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = CurfewTimetableFormDataModel.parse(req.body)
    const [act, options] = parseAction(action)

    if (act === 'add-time') {
      formData.curfewTimetable = this.addTimeToCurfewDay(formData.curfewTimetable, options)

      req.flash('formData', formData)
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
      return
    }

    if (act === 'remove-time') {
      formData.curfewTimetable = this.removeTimeFromCurfewDay(formData.curfewTimetable, options)

      req.flash('formData', formData)
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
      return
    }

    if (act === 'copy-times') {
      formData.curfewTimetable = this.copyTimeAcrossCurfewDays(formData.curfewTimetable)

      req.flash('formData', formData)
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
      return
    }

    const apiModel = createApiModelFromFormData(formData.curfewTimetable, orderId)
    const updateResult = await this.curfewTimetableService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: apiModel.filter(t => t.curfewAddress + t.startTime + t.endTime !== ''),
    })

    if (isValidationListResult(updateResult)) {
      const validationResult = apiModel.map((item, index) => {
        return {
          ...item,
          errors: updateResult.filter(it => it.index === index).at(0)?.errors ?? [],
        }
      })
      req.flash('validationErrors', validationResult)
      req.flash('formData', formData)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', orderId))
      return
    }

    if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('CURFEW_TIMETABLE', req.order!))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
  }
}
