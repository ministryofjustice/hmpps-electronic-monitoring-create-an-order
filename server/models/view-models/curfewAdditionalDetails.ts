import { CurfewConditions } from '../CurfewConditions'
import { CurfewAdditionalDetailsFormData } from '../form-data/curfewAdditionalDetails'

type CurfewAdditionalDetailsViewModel = { curfewAdditionalDetails: string }

const construct = (
  model: CurfewConditions | undefined | null,
  formData: [CurfewAdditionalDetailsFormData],
): CurfewAdditionalDetailsViewModel => {
  if (formData.length > 0) {
    return {
      curfewAdditionalDetails: formData[0].curfewAdditionalDetails,
    }
  }
  return {
    curfewAdditionalDetails: model?.curfewAdditionalDetails ?? '',
  }
}

export default { construct }
