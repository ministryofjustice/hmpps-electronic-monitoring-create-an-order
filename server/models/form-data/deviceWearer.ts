import { z } from 'zod'
import { BooleanInputModel, DateInputModel, FormDataModel, MultipleChoiceInputModel } from './formData'
import { DisabilityEnum, IdentityNumbersEnum } from '../DeviceWearer'
import { validationErrors } from '../../constants/validationErrors'

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
  disabilities: MultipleChoiceInputModel.pipe(z.array(DisabilityEnum)),
  otherDisability: z.string().optional(),
}).transform(data => {
  if (data.interpreterRequired === 'false') {
    return { ...data, language: '' }
  }
  return data
})

type DeviceWearerFormData = Omit<z.infer<typeof DeviceWearerFormDataParser>, 'action'>

// Validate form data on the client to ensure creation of successful api requests
const DeviceWearerFormDataValidator = z.object({
  firstName: z
    .string()
    .min(1, validationErrors.deviceWearer.firstNameRequired)
    .max(200, validationErrors.deviceWearer.firstNameMaxLength),
  lastName: z
    .string()
    .min(1, validationErrors.deviceWearer.lastNameRequired)
    .max(200, validationErrors.deviceWearer.lastNameMaxLength),
  alias: z.string().max(200, validationErrors.deviceWearer.preferredNameMaxLength),
  dateOfBirth: DateInputModel(validationErrors.deviceWearer.dateOfBirth),
  language: z.string().min(0, validationErrors.deviceWearer.languageRequired), // TODO ELM-3376 this needs changing to be conditional on interpreter needed
  adultAtTimeOfInstallation: BooleanInputModel.pipe(
    z.boolean({ message: validationErrors.deviceWearer.responsibleAdultRequired }),
  ),
  sex: z.string().min(1, validationErrors.deviceWearer.sexRequired),
  gender: z.string().min(1, validationErrors.deviceWearer.genderRequired),
  disabilities: MultipleChoiceInputModel.pipe(
    z.array(DisabilityEnum).min(1, validationErrors.deviceWearer.disabilitiesRequired),
  ).transform(val => val.join(',')),
  otherDisability: z.string().optional(),
  interpreterRequired: BooleanInputModel.pipe(
    z.boolean({
      message: validationErrors.deviceWearer.interpreterRequired,
    }),
  ),
})

// The output of validation should be an object that can be sent to the API
type DeviceWearerApiRequestBody = z.infer<typeof DeviceWearerFormDataValidator>

const IdentityNumbersFormDataModel = FormDataModel.extend({
  identityNumbers: MultipleChoiceInputModel.pipe(z.array(IdentityNumbersEnum)),
  nomisId: z.string().optional(),
  pncId: z.string().optional(),
  deliusId: z.string().optional(),
  prisonNumber: z.string().optional(),
  homeOfficeReferenceNumber: z.string().optional(),
  complianceAndEnforcementPersonReference: z.string().optional(),
  courtCaseReferenceNumber: z.string().optional(),
})

const IdentityNumbersFormDataValidator = z
  .object({
    identityNumbers: z.array(IdentityNumbersEnum),
    nomisId: z.string().optional(),
    pncId: z.string().optional(),
    deliusId: z.string().optional(),
    prisonNumber: z.string().optional(),
    homeOfficeReferenceNumber: z.string().optional(),
    complianceAndEnforcementPersonReference: z.string().optional(),
    courtCaseReferenceNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // at least select 1
    if (data.identityNumbers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['identityNumbers'],
        message: 'Select all identity numbers that you have for the device wearer',
      })
    }

    // if checkbox ticked, input entered
    if (data.identityNumbers.includes('NOMIS') && !data.nomisId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nomisId'], message: 'Enter NOMIS ID' })
    }
    if (data.identityNumbers.includes('PNC') && !data.pncId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pncId'], message: 'Enter PNC ID' })
    }
    if (data.identityNumbers.includes('DELIUS') && !data.deliusId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['deliusId'], message: 'Enter NDelius ID' })
    }
    if (data.identityNumbers.includes('PRISON_NUMBER') && !data.prisonNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['prisonNumber'], message: 'Enter Prison Number' })
    }
    if (data.identityNumbers.includes('HOME_OFFICE') && !data.homeOfficeReferenceNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['homeOfficeReferenceNumber'],
        message: 'Enter Home Office Reference Number',
      })
    }
    if (
      data.identityNumbers.includes('COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE') &&
      !data.complianceAndEnforcementPersonReference
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['complianceAndEnforcementPersonReference'],
        message: 'Enter Compliance and Enforcement Person Reference',
      })
    }
    if (data.identityNumbers.includes('COURT_CASE_REFERENCE_NUMBER') && !data.courtCaseReferenceNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['courtCaseReferenceNumber'],
        message: 'Enter Court Case Reference Number',
      })
    }
  })
  .transform(data => {
    // cleanup
    return {
      ...data,
      nomisId: data.identityNumbers.includes('NOMIS') ? data.nomisId : '',
      pncId: data.identityNumbers.includes('PNC') ? data.pncId : '',
      deliusId: data.identityNumbers.includes('DELIUS') ? data.deliusId : '',
      prisonNumber: data.identityNumbers.includes('PRISON_NUMBER') ? data.prisonNumber : '',
      homeOfficeReferenceNumber: data.identityNumbers.includes('HOME_OFFICE') ? data.homeOfficeReferenceNumber : '',
      complianceAndEnforcementPersonReference: data.identityNumbers.includes(
        'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE',
      )
        ? data.complianceAndEnforcementPersonReference
        : '',
      courtCaseReferenceNumber: data.identityNumbers.includes('COURT_CASE_REFERENCE_NUMBER')
        ? data.courtCaseReferenceNumber
        : '',
    }
  })

type IdentityNumbersFormData = Omit<z.infer<typeof IdentityNumbersFormDataModel>, 'action'>

export {
  DeviceWearerFormData,
  DeviceWearerFormDataParser,
  DeviceWearerApiRequestBody,
  DeviceWearerFormDataValidator,
  IdentityNumbersFormData,
  IdentityNumbersFormDataModel,
  IdentityNumbersFormDataValidator,
}
