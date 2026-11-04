import { DataDictionaryVersionEnum, DataDictionaryVersion, Order } from '../../models/Order'

export default function isOrderDataDictionarySameOrAbove(ddVersion: DataDictionaryVersion, order: Order): boolean {
  const entries = Object.keys(DataDictionaryVersionEnum.enum)
  const versionIndex = entries.indexOf(ddVersion)
  const orderVersionIndex = entries.indexOf(order.dataDictionaryVersion)
  return orderVersionIndex >= versionIndex
}
