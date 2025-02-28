import { z } from 'zod'
import { BooleanInputModel, DateInputModel, FormDataModel, MultipleChoiceInputModel } from './formData'
import { DisabilityEnum } from '../DeviceWearer'
import validationErrors from '../../constants/validationErrors'

// Parse html form data to ensure basic type safety at runtime
const DeviceWearerFormDataParser = FormDataModel.extend({
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  dateOfBirth: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  }),
  language: z.string(),
  interpreterRequired: z.string().default(''),
  adultAtTimeOfInstallation: z.string().default(''),
  sex: z.string().default(''),
  gender: z.string().default(''),
  otherGender: z.string().optional(),
  disabilities: MultipleChoiceInputModel.pipe(z.array(DisabilityEnum)),
  otherDisability: z.string().optional(),
})

type DeviceWearerFormData = Omit<z.infer<typeof DeviceWearerFormDataParser>, 'action'>

// Validate form data on the client to ensure creation of successful api requests
const DeviceWearerFormDataValidator = z.object({
  firstName: z.string().min(1, validationErrors.deviceWearer.firstNameRequired),
  lastName: z.string().min(1, validationErrors.deviceWearer.lastNameRequired),
  alias: z.string(),
  dateOfBirth: DateInputModel.pipe(z.string({ message: validationErrors.deviceWearer.dobRequired }).datetime()),
  language: z.string(),
  interpreterRequired: BooleanInputModel.pipe(
    z.boolean({
      message: validationErrors.deviceWearer.interpreterRequired,
    }),
  ),
  adultAtTimeOfInstallation: BooleanInputModel.pipe(
    z.boolean({ message: validationErrors.deviceWearer.responsibleAdultRequired }),
  ),
  sex: z.string().min(1, validationErrors.deviceWearer.sexRequired),
  gender: z.string().min(1, validationErrors.deviceWearer.genderRequired),
  otherGender: z.string().optional(),
  disabilities: MultipleChoiceInputModel.pipe(z.array(DisabilityEnum)).transform(val => val.join(',')),
  otherDisability: z.string().optional(),
})

// The output of validation should be an object that can be sent to the API
type DeviceWearerApiRequestBody = z.infer<typeof DeviceWearerFormDataValidator>

const IdentityNumbersFormDataModel = FormDataModel.extend({
  nomisId: z.string(),
  pncId: z.string(),
  deliusId: z.string(),
  prisonNumber: z.string(),
  homeOfficeReferenceNumber: z.string(),
})

export {
  DeviceWearerFormData,
  DeviceWearerFormDataParser,
  DeviceWearerApiRequestBody,
  DeviceWearerFormDataValidator,
  IdentityNumbersFormDataModel,
}
