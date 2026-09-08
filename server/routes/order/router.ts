import { type RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import paths from '../../constants/paths'
import { registerViewUpdate } from '../routeHelpers'
import OrderController from '../../controllers/orderController'
import ReceiptController from '../../controllers/receiptController'
import IsRejectionController from '../is-rejection/controller'
import SpecialOrderController from '../special-order/controller'
import IsAddressChangeController from '../variations/is-address-change/controller'
import NoRefitsController from '../variations/no-refits/controller'
import NoChangeResponsibleOfficerController from '../variations/no-change-responsible-officer/controller'

const createOrderRouter = (
  services: Pick<
    Services,
    'orderService' | 'sectionService' | 'fmsRequestService' | 'isRejectionService' | 'serviceRequestTypeService'
  >,
): Router => {
  const router = Router()
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const { orderService, sectionService, fmsRequestService, isRejectionService, serviceRequestTypeService } = services

  const orderController = new OrderController(orderService, sectionService)
  const receiptController = new ReceiptController(fmsRequestService)
  const isRejectionController = new IsRejectionController(isRejectionService)
  const specialOrderController = new SpecialOrderController()
  const isAddressChangeController = new IsAddressChangeController(serviceRequestTypeService)
  const noRefitsController = new NoRefitsController()
  const noChangeResonsibleOfficer = new NoChangeResponsibleOfficerController()

  post(paths.ORDER.CREATE, orderController.create)
  get(paths.ORDER.DELETE_SUCCESS, orderController.deleteSuccess)
  get(paths.ORDER.DELETE_FAILED, orderController.deleteFailed)
  get(paths.ORDER.SUMMARY, orderController.summary)
  get(paths.ORDER.SUMMARY_VERSION, orderController.summary)
  get(paths.ORDER.EDIT, orderController.confirmEdit)
  registerViewUpdate(router, paths.ORDER.IS_REJECTION, isRejectionController)
  post(paths.ORDER.VARIATION, orderController.createVariation)
  get(paths.ORDER.DELETE, orderController.confirmDelete)
  post(paths.ORDER.DELETE, orderController.delete)
  post(paths.ORDER.SUBMIT, orderController.submit)
  get(paths.ORDER.SUBMIT_SUCCESS, orderController.submitSuccess)
  get(paths.ORDER.SUBMIT_PARTIAL_SUCCESS, orderController.submitPartialSuccess)
  get(paths.ORDER.SUBMIT_FAILED, orderController.submitFailed)
  get(paths.ORDER.RECEIPT, receiptController.viewReceipt)
  get(paths.ORDER.RECEIPT_VERSION, receiptController.viewReceipt)
  get(paths.ORDER.RECEIPT_DOWNLOAD, receiptController.downloadReceipt)
  get(paths.ORDER.DOWNLOAD_FMS_DW_REQUEST, receiptController.downloadFmsDeviceWearerRequest)
  get(paths.ORDER.DOWNLOAD_FMS_MO_REQUEST, receiptController.downloadFmsMonitoringOrderRequest)
  registerViewUpdate(router, paths.ORDER.SPECIAL_ORDER, specialOrderController)
  registerViewUpdate(router, paths.ORDER.IS_ADDRESS_CHANGE, isAddressChangeController)
  get(paths.ORDER.NO_REFITS, noRefitsController.view)
  get(paths.ORDER.NO_CHANGE_RESPONSIBLE_OFFICER, noChangeResonsibleOfficer.view)
  post(paths.ORDER.UPDATE_ORDER_OWNER, orderController.assignOrderOwner)

  return router
}

export default createOrderRouter
