import { createGovukErrorSummary } from '../../utils/errors'
import { deserialiseDate, deserialiseTime, getError, getErrors } from '../../utils/utils'
import { CurfewReleaseDate } from '../CurfewReleaseDate'
import { CurfewReleaseDateFormData } from '../form-data/curfewReleaseDate'
import { ValidationResult } from '../Validation'
import { DateField, TimeSpanField, ViewModel } from './utils'

type CurfewReleaseDateViewModel = ViewModel<Pick<CurfewReleaseDate, 'curfewAddress'>> & {
  releaseDate: DateField
  curfewTimes: TimeSpanField
}

const createViewModelFromCurfewReleaseDate = (
  curfewReleaseDate?: CurfewReleaseDate | null,
): CurfewReleaseDateViewModel => {
  const [releaseDateYear, releaseDateMonth, releaseDateDay] = deserialiseDate(curfewReleaseDate?.releaseDate)

  const [startHours, startMinutes] = deserialiseTime(curfewReleaseDate?.startTime)
  const [endHours, endMinutes] = deserialiseTime(curfewReleaseDate?.endTime)

  return {
    curfewAddress: { value: curfewReleaseDate?.curfewAddress ?? '' },
    releaseDate: { value: { year: releaseDateYear, month: releaseDateMonth, day: releaseDateDay } },
    curfewTimes: { value: { startHours, startMinutes, endHours, endMinutes } },
    errorSummary: null,
  }
}

const createViewModelFromFormData = (
  formData: CurfewReleaseDateFormData,
  validationErrors: ValidationResult,
): CurfewReleaseDateViewModel => {
  return {
    curfewAddress: { value: formData?.address ?? '', error: getError(validationErrors, 'curfewAddress') },
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
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const construct = (
  curfewReleaseDate: CurfewReleaseDate | undefined | null,
  validationErrors: ValidationResult,
  formData: [CurfewReleaseDateFormData],
): CurfewReleaseDateViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors)
  }

  return createViewModelFromCurfewReleaseDate(curfewReleaseDate)
}

export default {
  construct,
}
