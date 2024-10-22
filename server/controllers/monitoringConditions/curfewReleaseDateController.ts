import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { CurfewReleaseDate } from '../../models/CurfewReleaseDate'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { DateField, TextField, TimeSpanField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import CurfewReleaseDateService from '../../services/curfewReleaseDateService'
import { deserialiseDate, deserialiseTime, getError, getErrors, serialiseDate, serialiseTime } from '../../utils/utils'

const CurfewReleaseDateFormDataModel = z.object({
  action: z.string().default('continue'),
  address: z.string().optional(),
  releaseDateDay: z.string(),
  releaseDateMonth: z.string(),
  releaseDateYear: z.string(),
  curfewTimesStartHours: z.string(),
  curfewTimesStartMinutes: z.string(),
  curfewTimesEndHours: z.string(),
  curfewTimesEndMinutes: z.string(),
})

type CurfewReleaseDateFormData = z.infer<typeof CurfewReleaseDateFormDataModel>

type CurfewReleaseDateViewModel = {
  address: TextField
  releaseDate: DateField
  curfewTimes: TimeSpanField
}

export default class CurfewReleaseDateController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewReleaseDateService: CurfewReleaseDateService,
  ) {}

  private constructViewModel(
    curfewReleaseDate: CurfewReleaseDate | undefined | null,
    validationErrors: ValidationResult,
    formData: [CurfewReleaseDateFormData],
  ): CurfewReleaseDateViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors)
    }

    return this.createViewModelFromCurfewReleaseDate(curfewReleaseDate)
  }

  private createViewModelFromCurfewReleaseDate(
    curfewReleaseDate?: CurfewReleaseDate | null,
  ): CurfewReleaseDateViewModel {
    const [releaseDateYear, releaseDateMonth, releaseDateDay] = deserialiseDate(curfewReleaseDate?.releaseDate)

    const [startHours, startMinutes] = deserialiseTime(curfewReleaseDate?.startTime)
    const [endHours, endMinutes] = deserialiseTime(curfewReleaseDate?.endTime)

    return {
      address: { value: curfewReleaseDate?.curfewAddress ?? '' },
      releaseDate: { value: { year: releaseDateYear, month: releaseDateMonth, day: releaseDateDay } },
      curfewTimes: { value: { startHours, startMinutes, endHours, endMinutes } },
    }
  }

  private createViewModelFromFormData(
    formData: CurfewReleaseDateFormData,
    validationErrors: ValidationResult,
  ): CurfewReleaseDateViewModel {
    return {
      address: { value: formData?.address ?? '', error: getError(validationErrors, 'curfewAddress') },
      releaseDate: {
        value: {
          year: formData.releaseDateYear,
          month: formData.releaseDateMonth,
          day: formData.releaseDateDay,
        },
        error: getError(validationErrors, 'releaseDate'),
      },
      curfewTimes: {
        value: {
          startHours: formData.curfewTimesStartHours,
          startMinutes: formData.curfewTimesStartMinutes,
          endHours: formData.curfewTimesEndHours,
          endMinutes: formData.curfewTimesEndMinutes,
        },
        error: getErrors(validationErrors, ['startTime', 'endTime']),
      },
    }
  }

  createApiModelFromFormData(formData: CurfewReleaseDateFormData, orderId: string): CurfewReleaseDate {
    return {
      releaseDate: serialiseDate(formData.releaseDateYear, formData.releaseDateMonth, formData.releaseDateDay),
      orderId,
      startTime: serialiseTime(formData.curfewTimesStartHours, formData.curfewTimesStartMinutes),
      endTime: serialiseTime(formData.curfewTimesEndHours, formData.curfewTimesEndMinutes),
      curfewAddress: formData.address ?? null,
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { curfewReleaseDateConditions: model } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(model, errors as never, formData as never)

    res.render(`pages/order/monitoring-conditions/curfew-release-date`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = CurfewReleaseDateFormDataModel.parse(req.body)

    const updateResult = await this.curfewReleaseDateService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: this.createApiModelFromFormData(formData, orderId),
    })

    if (isValidationResult(updateResult)) {
      req.flash('formData', [formData])
      req.flash('validationErrors', updateResult)

      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', orderId))
    } else {
      res.redirect(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId))
    }
  }
}
