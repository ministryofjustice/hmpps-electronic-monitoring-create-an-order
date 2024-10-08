import { z } from 'zod'

const MonitoringConditionsModel = z.object({})

export type MonitoringConditions = z.infer<typeof MonitoringConditionsModel>

export default MonitoringConditionsModel
