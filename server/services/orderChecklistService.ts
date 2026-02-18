import OrderChecklistStore from '../data/orderChecklistStore/OrderChecklistStore'
import OrderChecklistModel from '../models/OrderChecklist'

export default class OrderChecklistService {
  constructor(private readonly dataStore: OrderChecklistStore) {}

  public async updateChecklist(
    key: string,
    section:
      | 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATION'
      | 'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM'
      | 'ABOUT_THE_DEVICE_WEARER'
      | 'CONTACT_INFORMATION'
      | 'RISK_INFORMATION'
      | 'ELECTRONIC_MONITORING_CONDITIONS'
      | 'ADDITIONAL_DOCUMENTS',
  ) {
    let checklist = await this.dataStore.getSectionCheckStatus(key)
    if (checklist == null) {
      checklist = OrderChecklistModel.parse({})
    }
    checklist[section] = true
    await this.dataStore.setSectionCheckStatus(key, checklist, 60 * 60)
  }

  public async getChecklist(key: string) {
    let checklist = await this.dataStore.getSectionCheckStatus(key)
    if (checklist == null) {
      checklist = OrderChecklistModel.parse({})
    }
    await this.dataStore.setSectionCheckStatus(key, checklist, 24 * 60 * 60)
    return checklist
  }
}
