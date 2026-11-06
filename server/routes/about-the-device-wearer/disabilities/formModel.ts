import { z } from 'zod'
import { FormDataModel, MultipleChoiceInputModel } from '../../../models/form-data/formData'
import { DisabilityEnum } from '../../../models/DeviceWearer'
import { validationErrors } from '../../../constants/validationErrors'

const DisabilitiesFormDataModel = FormDataModel.extend({
  disabilities: MultipleChoiceInputModel.pipe(z.array(DisabilityEnum)),
  otherDisability: z.string().default(''),
})

type DisabilitiesFormData = Omit<z.infer<typeof DisabilitiesFormDataModel>, 'action'>

const DisabilitiesFormDataValidator = z
  .object({
    disabilities: z.array(DisabilityEnum).min(1, validationErrors.deviceWearer.disabilitiesRequired),
    otherDisability: z.string().default(''),
  })
  .refine(({ disabilities, otherDisability }) => !disabilities.includes('OTHER') || otherDisability.trim().length > 0, {
    path: ['otherDisability'],
    message: "Enter the device wearer's disability or health condition",
  })
  .transform(({ disabilities, otherDisability }) => ({
    disabilities,
    otherDisability: disabilities.includes('OTHER') ? otherDisability : '',
  }))

export { DisabilitiesFormData, DisabilitiesFormDataModel, DisabilitiesFormDataValidator }
