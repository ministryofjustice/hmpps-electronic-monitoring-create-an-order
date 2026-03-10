import InterestedPartiesModel, { InterestedParties } from './model'
import { Order } from '../../models/Order'
import Store from '../store/store'
import { notifyingOrganisationCourts } from '../../models/NotifyingOrganisation'

export default class InterestedPartiesStoreService {
  constructor(private readonly dataStore: Store) {}

  private readonly FIELD_HIERARCHY: (keyof InterestedParties)[] = [
    'notifyingOrganisation',
    'notifyingOrganisationName',
    'notifyingOrganisationEmail',
    'responsibleOfficerFirstName',
    'responsibleOfficerLastName',
    'responsibleOfficerEmail',
    'responsibleOrganisation',
    'responsibleOrganisationRegion',
    'responsibleOrganisationEmail',
  ]

  private keyFromOrder(order: Order): string {
    return `${order.id}+${order.versionId}`
  }

  public async updateInterestedParties(order: Order, data: InterestedParties) {
    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify(data), 24 * 60 * 60)
  }

  public async getInterestedParties(order: Order): Promise<InterestedParties> {
    const key = this.keyFromOrder(order)
    let result = await this.dataStore.get(key)

    if (result === null) {
      result = JSON.stringify(order.interestedParties ? order.interestedParties : {})
    }
    await this.dataStore.set(key, result, 24 * 60 * 60)

    const data = InterestedPartiesModel.parse(JSON.parse(result))

    return data
  }

  public async updateField<T extends keyof InterestedParties>(order: Order, field: T, data: InterestedParties[T]) {
    let interestedParties = await this.getInterestedParties(order)

    interestedParties = this.getClearedData(interestedParties, field)

    interestedParties[field] = data
    await this.updateInterestedParties(order, interestedParties)
  }

  public async updateNotifyingOrganisation(
    order: Order,
    data: Pick<InterestedParties, 'notifyingOrganisation' | 'notifyingOrganisationName' | 'notifyingOrganisationEmail'>,
  ) {
    let interestedParties = await this.getInterestedParties(order)

    if ((notifyingOrganisationCourts as readonly string[]).indexOf(data.notifyingOrganisation!) > -1) {
      interestedParties = this.getClearedData(interestedParties, 'notifyingOrganisation', 'responsibleOrganisation')
    }

    interestedParties.notifyingOrganisation = data.notifyingOrganisation
    interestedParties.notifyingOrganisationName = data.notifyingOrganisationName
    interestedParties.notifyingOrganisationEmail = data.notifyingOrganisationEmail
    await this.updateInterestedParties(order, interestedParties)
  }

  public async updateResponsibleOrganisation(
    order: Order,
    data: Pick<
      InterestedParties,
      'responsibleOrganisation' | 'responsibleOrganisationRegion' | 'responsibleOrganisationEmail'
    >,
  ) {
    const interestedParties = await this.getInterestedParties(order)

    interestedParties.responsibleOrganisation = data.responsibleOrganisation
    interestedParties.responsibleOrganisationRegion = data.responsibleOrganisationRegion
    interestedParties.responsibleOrganisationEmail = data.responsibleOrganisationEmail

    await this.updateInterestedParties(order, interestedParties)
  }

  public async UpdateResponsibleOfficer(
    order: Order,
    data: Pick<
      InterestedParties,
      'responsibleOfficerFirstName' | 'responsibleOfficerLastName' | 'responsibleOfficerEmail'
    >,
  ) {
    const interestedParties = await this.getInterestedParties(order)

    interestedParties.responsibleOfficerFirstName = data.responsibleOfficerFirstName
    interestedParties.responsibleOfficerLastName = data.responsibleOfficerLastName
    interestedParties.responsibleOfficerEmail = data.responsibleOfficerEmail

    await this.updateInterestedParties(order, interestedParties)
  }

  private getClearedData(
    currentData: InterestedParties,
    updatedField: keyof InterestedParties,
    keepField?: keyof InterestedParties,
  ) {
    const updatedIndex = this.FIELD_HIERARCHY.indexOf(updatedField)

    const keepIndex = keepField ? this.FIELD_HIERARCHY.indexOf(keepField) : this.FIELD_HIERARCHY.length - 1
    const fieldsToClear = this.FIELD_HIERARCHY.slice(updatedIndex + 1, keepIndex)

    const newData = { ...currentData }

    fieldsToClear.forEach(field => delete newData[field])

    return newData
  }
}
