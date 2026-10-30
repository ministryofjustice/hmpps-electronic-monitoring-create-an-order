import { getMockOrder } from '../../../test/mocks/mockOrder'
import RestClient from '../../data/restClient'
import InMemoryStore from '../store/inMemoryStore'
import DeviceWearerAnswersService from './deviceWearerAnswersService'
import DeviceWearerStoreService from './store/deviceWearerStoreService'

describe('DeviceWearerAnswersService', () => {
  const order = getMockOrder()
  let service: DeviceWearerAnswersService

  beforeEach(() => {
    service = new DeviceWearerAnswersService(new DeviceWearerStoreService(new InMemoryStore()), {} as RestClient)
  })

  describe('saveLanguage', () => {
    it('saves the interpreter language when an interpreter is needed', async () => {
      await service.saveLanguage(order, { interpreterRequired: true, language: 'Arabic' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.interpreterRequired).toBe(true)
      expect(answers.language).toEqual('Arabic')
    })

    it('clears a previously saved language when an interpreter is not needed', async () => {
      await service.saveLanguage(order, { interpreterRequired: true, language: 'Arabic' })

      await service.saveLanguage(order, { interpreterRequired: false, language: 'Arabic' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.interpreterRequired).toBe(false)
      expect(answers.language).toEqual('')
    })

    it('keeps the answers from the other device wearer pages', async () => {
      await service.saveLanguage(order, { interpreterRequired: false, language: '' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.firstName).toEqual(order.deviceWearer.firstName)
      expect(answers.disabilities).toEqual(order.deviceWearer.disabilities)
    })
  })
})
