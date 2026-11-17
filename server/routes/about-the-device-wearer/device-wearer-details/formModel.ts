import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import { SexEnum } from '../../../models/DeviceWearer'
import { DateInputModel } from '../../../models/form-data/formData'

// A single question page: the only action is Continue, so the posted action is not needed
const DeviceWearerDetailsFormDataParser = z.object({
  firstName: z.string().trim().default(''),
  middleName: z.string().default(''),
  lastName: z.string().trim().default(''),
  alias: z.string().default(''),
  dateOfBirth: z
    .object({
      day: z.string().default(''),
      month: z.string().default(''),
      year: z.string().default(''),
    })
    .default({ day: '', month: '', year: '' }),
  sex: z.string().default(''),
  gender: z.string().default(''),
})

type DeviceWearerDetailsFormData = z.infer<typeof DeviceWearerDetailsFormDataParser>

// The same rules as the combined device wearer page, limited to the personal details questions
const DeviceWearerDetailsFormDataValidator = z.object({
  firstName: z
    .string()
    .min(1, validationErrors.deviceWearer.firstNameRequired)
    .max(200, validationErrors.deviceWearer.firstNameMaxLength),
  middleName: z.string().max(200, validationErrors.deviceWearer.middleNameMaxLength),
  lastName: z
    .string()
    .min(1, validationErrors.deviceWearer.lastNameRequired)
    .max(200, validationErrors.deviceWearer.lastNameMaxLength),
  alias: z.string().max(200, validationErrors.deviceWearer.preferredNameMaxLength),
  dateOfBirth: DateInputModel(validationErrors.deviceWearer.dateOfBirth),
  sex: z
    .string()
    .min(1, validationErrors.deviceWearer.sexRequired)
    .pipe(z.enum(SexEnum.options, { error: validationErrors.deviceWearer.sexRequired })),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_TO_SELF_DESCRIBE', 'NOT_ABLE_TO_PROVIDE_THIS_INFORMATION'], {
    error: validationErrors.deviceWearer.genderRequired,
  }),
})

type DeviceWearerDetailsAnswers = z.infer<typeof DeviceWearerDetailsFormDataValidator>

export {
  DeviceWearerDetailsAnswers,
  DeviceWearerDetailsFormData,
  DeviceWearerDetailsFormDataParser,
  DeviceWearerDetailsFormDataValidator,
}
