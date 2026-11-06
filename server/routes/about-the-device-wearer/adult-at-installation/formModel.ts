import { z } from 'zod'
import { validationErrors } from '../../../constants/validationErrors'
import { BooleanInputModel } from '../../../models/form-data/formData'

const AdultAtInstallationFormModel = z.object({
  action: z.string().default('continue'),
  adultAtTimeOfInstallation: z.string().default(''),
})

export const AdultAtInstallationFormValidator = z.object({
  adultAtTimeOfInstallation: BooleanInputModel.pipe(
    z.boolean({ message: validationErrors.deviceWearer.responsibleAdultRequired }),
  ),
})

export type AdultAtInstallationFormInput = z.infer<typeof AdultAtInstallationFormModel>
export default AdultAtInstallationFormModel
