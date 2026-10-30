import { z } from 'zod'
import paths from '../../constants/paths'
import { validationErrors } from '../../constants/validationErrors'
import { ValidationResult } from '../../models/Validation'
import { convertZodErrorToValidationError } from '../../utils/validation/errors'
import { DeviceWearerCache } from './store/model'

export type DeviceWearerPage = { path: string; errors: ValidationResult }

// These validators check a page has been answered in the cache, they are not the form validators.
const DeviceWearerDetailsAnswered = z.object({
  firstName: z.string({ message: validationErrors.deviceWearer.firstNameRequired }).min(1),
  lastName: z.string({ message: validationErrors.deviceWearer.lastNameRequired }).min(1),
  dateOfBirth: z.string({ message: validationErrors.deviceWearer.dateOfBirth.required }),
  sex: z.string({ message: validationErrors.deviceWearer.sexRequired }).min(1),
  gender: z.string({ message: validationErrors.deviceWearer.genderRequired }).min(1),
})

const DisabilitiesAnswered = z.object({
  disabilities: z.array(z.string(), { message: validationErrors.deviceWearer.disabilitiesRequired }).min(1),
})

const LanguageAnswered = z.object({
  interpreterRequired: z.boolean({ message: validationErrors.deviceWearer.interpreterRequired }),
})

const AdultAtInstallationAnswered = z.object({
  adultAtTimeOfInstallation: z.boolean({ message: validationErrors.deviceWearer.responsibleAdultRequired }),
})

const PAGES = [
  {
    path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS,
    fields: ['firstName', 'middleName', 'lastName', 'alias', 'dateOfBirth', 'sex', 'gender'],
    validator: DeviceWearerDetailsAnswered,
  },
  {
    path: paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES,
    fields: ['disabilities'],
    validator: DisabilitiesAnswered,
  },
  {
    path: paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE,
    fields: ['interpreterRequired', 'language'],
    validator: LanguageAnswered,
  },
  {
    path: paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION,
    fields: ['adultAtTimeOfInstallation'],
    validator: AdultAtInstallationAnswered,
  },
]

export const pageForErrors = (errors: ValidationResult, orderId: string): DeviceWearerPage | null => {
  const page = PAGES.find(({ fields }) => errors.some(({ field }) => fields.includes(field)))
  if (!page) return null

  return {
    path: page.path.replace(':orderId', orderId),
    errors: errors.filter(({ field }) => page.fields.includes(field)),
  }
}

export const findMissingAnswers = (answers: DeviceWearerCache): ValidationResult =>
  PAGES.flatMap(({ validator }) => {
    const result = validator.safeParse(answers)
    return result.success ? [] : convertZodErrorToValidationError(result.error)
  })

export const firstUnansweredPage = (answers: DeviceWearerCache, orderId: string): string | null =>
  pageForErrors(findMissingAnswers(answers), orderId)?.path ?? null
