import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'

const constructModel = (_order: Order, errors: ValidationResult) => {
  return {
    standardCurfewTimes: { value: '' },
    errorSummary: null,
  }
}

export default constructModel
