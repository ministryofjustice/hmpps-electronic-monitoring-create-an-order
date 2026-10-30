import { z } from 'zod'
import { FormDataModel, MultipleChoiceInputModel } from '../../../models/form-data/formData'
import { DisabilityEnum } from '../../../models/DeviceWearer'
import { validationErrors } from '../../../constants/validationErrors'

// otherDisability is deliberately not parsed: the unlisted condition description cannot be sent to the
// monitoring supplier, so the page does not capture it.
const DisabilitiesFormDataModel = FormDataModel.extend({
  disabilities: MultipleChoiceInputModel.pipe(z.array(DisabilityEnum)),
})

type DisabilitiesFormData = Omit<z.infer<typeof DisabilitiesFormDataModel>, 'action'>

const DisabilitiesFormDataValidator = z.object({
  disabilities: z.array(DisabilityEnum).min(1, validationErrors.deviceWearer.disabilitiesRequired),
})

export { DisabilitiesFormData, DisabilitiesFormDataModel, DisabilitiesFormDataValidator }
