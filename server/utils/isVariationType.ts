import { VariationTypesEnum } from '../models/Order'

export default function isVariationType(type: string): boolean {
  return VariationTypesEnum.options.filter(option => option === type).length !== 0
}
