import { Order } from '../../models/Order'
import { isPastDatedProbationVariation } from './orderStartDate'

const usesRevocationPaperwork = (order: Order) => order.type === 'REVOCATION' && isPastDatedProbationVariation(order)

export default usesRevocationPaperwork
