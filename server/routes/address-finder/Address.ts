import { z } from 'zod'
import { camelCaseToSentenceCase } from '../../utils/utils'

export const addressSchema = z.object({ ADDRESS: z.string() })

type AddressResponse = z.infer<typeof addressSchema>

export default class Address {
  private address: string

  constructor(address: string) {
    this.address = address
  }

  static fromJson(data: AddressResponse) {
    return new Address(data.ADDRESS)
  }

  public displayText(): string {
    return camelCaseToSentenceCase(this.address.toLowerCase())
  }
}
