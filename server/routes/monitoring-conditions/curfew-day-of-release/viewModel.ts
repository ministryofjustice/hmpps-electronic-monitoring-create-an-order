import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'

export type CurfewDayOfReleaseViewModel = ViewModel<{
  standardCurfewTimes: string
}>

const constructModel = (_order: Order, _errors: ValidationResult): CurfewDayOfReleaseViewModel => ({
  standardCurfewTimes: { value: '' },
  errorSummary: null,
})

export default constructModel
