import { v4 as uuidv4 } from 'uuid'
import Model from './model'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { createAddress } from '../../../../test/mocks/mockOrder'

describe('confirm address model', () => {
  const orderId = uuidv4()
  const content = getContent('en', 'DDV6')
  const address = createAddress({
    addressLine1: '1 Washington Street',
    addressLine2: '',
    addressLine3: 'Worcester',
    addressLine4: '',
    postcode: 'WR1 1NL',
  })

  it('device wearer confirmation page model', () => {
    const model = Model.construct(address, content, {
      orderId,
      addressType: 'PRIMARY',
      postcode: 'wr11nl',
      buildingId: '1',
      addressCount: 6,
      useDifferentAddressLink: `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', orderId).replace(':addressType', 'PRIMARY')}?postcode=wr11nl&buildingId=1`,
    })

    expect(model.content).toEqual(content.pages.deviceWearerAddressConfirm)
    expect(model.postcode).toBe('wr11nl')
    expect(model.addressCount).toBe(6)
    expect(model.buildingId).toBe('1')
    expect(model.address).toEqual({
      addressLine1: '1 Washington Street',
      addressLine2: '',
      addressLine3: 'Worcester',
      addressLine4: '',
      postcode: 'WR1 1NL',
    })

    expect(model.searchAgainLink).toBe(
      paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', orderId).replace(':addressType', 'PRIMARY'),
    )

    expect(model.manualAddressLink).toBe(
      paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', orderId).replace(':addressType', 'PRIMARY'),
    )

    expect(model.useDifferentAddressLink).toBe(
      `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', orderId).replace(':addressType', 'PRIMARY')}?postcode=wr11nl&buildingId=1`,
    )
  })

  it('curfew confirmation page model', () => {
    const model = Model.construct(address, content, {
      orderId,
      addressType: 'SECONDARY',
      postcode: 'wr11nl',
      buildingId: '1',
      addressCount: 6,
      useDifferentAddressLink: `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', orderId).replace(':addressType', 'SECONDARY')}?postcode=wr11nl&buildingId=1`,
    })

    expect(model.content).toEqual(content.pages.curfewAddressConfirm)
  })

  it('installation confirmation page model', () => {
    const model = Model.construct(address, content, {
      orderId,
      addressType: 'INSTALLATION',
      postcode: 'wr11nl',
      buildingId: '1',
      addressCount: 6,
      useDifferentAddressLink: `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', orderId).replace(':addressType', 'INSTALLATION')}?postcode=wr11nl&buildingId=1`,
    })

    expect(model.content).toEqual(content.pages.tagAtSourceAddressConfirm)
  })
})
