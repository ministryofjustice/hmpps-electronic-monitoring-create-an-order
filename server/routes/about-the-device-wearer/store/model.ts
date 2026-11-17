import { z } from 'zod'
import DeviceWearerModel, { DisabilityEnum } from '../../../models/DeviceWearer'

// Cached data is already in entity shape, so disabilities is an array rather than the API's comma-separated string
const DeviceWearerCacheModel = DeviceWearerModel.extend({ disabilities: z.array(DisabilityEnum) }).partial()

export type DeviceWearerCache = z.infer<typeof DeviceWearerCacheModel>

export default DeviceWearerCacheModel
