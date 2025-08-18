import { OrderChecklist } from '../../models/OrderChecklist'

export default interface OrderChecklistStore {
  setSectionCheckStatus(key: string, token: OrderChecklist, durationSeconds: number): Promise<void>
  getSectionCheckStatus(key: string): Promise<OrderChecklist | null>
}
