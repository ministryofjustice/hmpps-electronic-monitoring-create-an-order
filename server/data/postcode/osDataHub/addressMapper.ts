import { AddressWithoutType } from '../../../models/Address'
import { OSDataHubAddress, OSDataHubPostcodeResponse } from './osDataHubPostcodeResponse'
import { toTitleCase } from '../../../utils/utils'
import logger from '../../../../logger'

export default class AddressMapper {
  mapToAddresses(data: OSDataHubPostcodeResponse): AddressWithoutType[] {
    return data.results.map(address => this.mapToAddress(address))
  }

  private mapToAddress(dataHubAddress: OSDataHubAddress): AddressWithoutType {
    const address = dataHubAddress.DPA

    const buildingId = this.addressLineOne(address.ORGANISATION_NAME, address.BUILDING_NUMBER, address.BUILDING_NAME)

    return {
      addressLine1: `${buildingId} ${toTitleCase(address.THOROUGHFARE_NAME || '')}`,
      addressLine2: toTitleCase(address.SUB_BUILDING_NAME || ''),
      addressLine3: toTitleCase(address.POST_TOWN || ''),
      addressLine4: toTitleCase(address.LOCAL_CUSTODIAN_CODE_DESCRIPTION || ''),
      postcode: address.POSTCODE,
    }
  }

  private addressLineOne(
    orgName: string | undefined,
    buildingNumber: number | undefined,
    buildingName: string | undefined,
  ): string {
    const value = orgName || buildingNumber?.toString() || buildingName

    if (value === undefined) {
      logger.error('Unabled to map address')
      return ''
    }

    return value
  }
}
