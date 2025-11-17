import { Handler, Request, Response } from 'express'
import Model from './viewModel'
import RemoveMonitoringTypeService from './service'
import paths from '../../../constants/paths'
import { findMonitoringTypeById, getAllMonitoringTypes } from '../utils/monitoringTypes'

export default class RemoveMonitoringTypeController {
  constructor(private readonly service: RemoveMonitoringTypeService) {}

  view: Handler = (req: Request, res: Response) => {
    const { monitoringTypeId } = req.params
    const { order } = req
    if (!order) {
      res.status(400).send('Order not found on request')
      return
    }

    const monitoringTypeData = findMonitoringTypeById(order, monitoringTypeId)

    if (monitoringTypeData === undefined) {
      res.status(404).send(`No matching monitoring type: ${monitoringTypeId}`)
      return
    }

    const model = Model.construct(monitoringTypeData)

    res.render('pages/order/monitoring-conditions/remove-monitoring-type', model)
  }

  update: Handler = async (req: Request, res: Response) => {
    const { monitoringTypeId } = req.params

    const { order } = req
    if (!order) {
      res.status(400).send('Order not found on request')
      return
    }

    if (req.body.action === 'continue') {
      await this.service.removeMonitoringType({
        orderId: order.id,
        monitoringTypeId,
        accessToken: res.locals.user.token,
      })
      const remainingMonitoringTypes = getAllMonitoringTypes(order).filter(type => type.id !== monitoringTypeId)
      if (remainingMonitoringTypes.length === 0) {
        await this.service.removeTagAtSource({ orderId: order.id, accessToken: res.locals.user.token })
        res.redirect(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', order.id))
        return
      }
    }

    res.redirect(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(':orderId', order.id),
    )
  }
}
