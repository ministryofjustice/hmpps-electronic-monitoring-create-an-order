import { Request, Response } from 'express'
import { isValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import DeviceWearerAnswersService from './deviceWearerAnswersService'
import { firstUnansweredPage, pageForErrors } from './deviceWearerPages'

const continueDeviceWearer = async (
  req: Request,
  res: Response,
  deviceWearerAnswersService: DeviceWearerAnswersService,
  taskListService: TaskListService,
  currentPath: string,
) => {
  const order = req.order!

  const unansweredPage = firstUnansweredPage(await deviceWearerAnswersService.getDeviceWearer(order), order)
  if (unansweredPage) {
    res.redirect(unansweredPage)
    return
  }

  const result = await deviceWearerAnswersService.submit({ accessToken: res.locals.user.token, order })

  if (isValidationResult(result)) {
    const route = pageForErrors(result, order) ?? { path: currentPath, errors: result }
    req.flash('validationErrors', route.errors)
    res.redirect(route.path)
  } else {
    res.redirect(taskListService.getNextPage('DEVICE_WEARER', { ...order, deviceWearer: result }))
  }
}

export default continueDeviceWearer
