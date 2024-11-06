import { type RequestHandler, Router } from 'express'

import PDFDocument from 'pdfkit'
import fs from 'fs'
import pdf from 'html-pdf'
import path from 'path'
import AttachmentsController from '../controllers/attachmentController'
import AddressController from '../controllers/contact-information/addressController'
import ContactDetailsController from '../controllers/contact-information/contactDetailsController'
import NoFixedAbodeController from '../controllers/contact-information/noFixedAbodeController'
import InterestedPartiesController from '../controllers/contact-information/interestedPartiesController'
import DeviceWearerController from '../controllers/deviceWearerController'
import ResponsibleAdultController from '../controllers/deviceWearerResponsibleAdultController'
import DeviceWearerCheckAnswersController from '../controllers/deviceWearersCheckAnswersController'
import InstallationAndRiskController from '../controllers/installationAndRisk/installationAndRiskController'
import AlcoholMonitoringController from '../controllers/monitoringConditions/alcoholMonitoringController'
import AttendanceMonitoringController from '../controllers/monitoringConditions/attendanceMonitoringController'
import CurfewConditionsController from '../controllers/monitoringConditions/curfewConditionsController'
import CurfewReleaseDateController from '../controllers/monitoringConditions/curfewReleaseDateController'
import CurfewTimetableController from '../controllers/monitoringConditions/curfewTimetableController'
import EnforcementZoneController from '../controllers/monitoringConditions/enforcementZoneController'
import MonitoringConditionsController from '../controllers/monitoringConditions/monitoringConditionsController'
import TrailMonitoringController from '../controllers/monitoringConditions/trailMonitoringController'
import OrderController from '../controllers/orderController'
import OrderSearchController from '../controllers/orderSearchController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import populateOrder from '../middleware/populateCurrentOrder'
import type { Services } from '../services'
import paths from '../constants/paths'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  alcoholMonitoringService,
  attachmentService,
  attendanceMonitoringService,
  auditService,
  contactDetailsService,
  curfewConditionsService,
  curfewReleaseDateService,
  curfewTimetableService,
  addressService,
  deviceWearerResponsibleAdultService,
  deviceWearerService,
  installationAndRiskService,
  monitoringConditionsService,
  interestedPartiesService,
  orderService,
  orderSearchService,
  taskListService,
  trailMonitoringService,
  zoneService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const addressController = new AddressController(auditService, addressService, taskListService)
  const alcoholMonitoringController = new AlcoholMonitoringController(
    auditService,
    alcoholMonitoringService,
    taskListService,
  )
  const attachmentsController = new AttachmentsController(auditService, orderService, attachmentService)
  const attendanceMonitoringController = new AttendanceMonitoringController(
    auditService,
    attendanceMonitoringService,
    taskListService,
  )
  const contactDetailsController = new ContactDetailsController(auditService, contactDetailsService, taskListService)
  const curfewReleaseDateController = new CurfewReleaseDateController(
    auditService,
    curfewReleaseDateService,
    taskListService,
  )
  const curfewTimetableController = new CurfewTimetableController(auditService, curfewTimetableService, taskListService)
  const curfewConditionsController = new CurfewConditionsController(
    auditService,
    curfewConditionsService,
    taskListService,
  )
  const deviceWearerController = new DeviceWearerController(auditService, deviceWearerService, taskListService)
  const deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(auditService)
  const installationAndRiskController = new InstallationAndRiskController(
    auditService,
    installationAndRiskService,
    taskListService,
  )
  const monitoringConditionsController = new MonitoringConditionsController(
    auditService,
    monitoringConditionsService,
    taskListService,
  )
  const noFixedAbodeController = new NoFixedAbodeController(auditService, deviceWearerService, taskListService)
  const notifyingOrganisationController = new InterestedPartiesController(
    auditService,
    interestedPartiesService,
    taskListService,
  )
  const orderSearchController = new OrderSearchController(auditService, orderSearchService)
  const orderController = new OrderController(auditService, orderService, taskListService)
  const responsibleAdultController = new ResponsibleAdultController(
    auditService,
    deviceWearerResponsibleAdultService,
    taskListService,
  )
  const trailMonitoringController = new TrailMonitoringController(auditService, trailMonitoringService, taskListService)
  const zoneController = new EnforcementZoneController(auditService, zoneService, taskListService)

  router.param('orderId', populateOrder(orderService))

  get('/', orderSearchController.search)

  // Order
  post(paths.ORDER.CREATE, orderController.create)
  get(paths.ORDER.DELETE_SUCCESS, orderController.deleteSuccess)
  get(paths.ORDER.DELETE_FAILED, orderController.deleteFailed)
  get(paths.ORDER.SUMMARY, orderController.summary)
  get(paths.ORDER.DELETE, orderController.confirmDelete)
  post(paths.ORDER.DELETE, orderController.delete)
  post(paths.ORDER.SUBMIT, orderController.submit)
  get(paths.ORDER.SUBMIT_SUCCESS, orderController.submitSuccess)
  get(paths.ORDER.SUBMIT_FAILED, orderController.submitFailed)

  /**
   * ABOUT THE DEVICE WEARER
   */

  // Device Wearer
  get(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER, deviceWearerController.update)

  // Responsible Adult
  get(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.view)
  post(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT, responsibleAdultController.update)

  // Check your answers
  get(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, deviceWearerCheckAnswersController.view)

  /**
   * CONTACT INFORMATION
   */

  // Contact details
  get(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.view)
  post(paths.CONTACT_INFORMATION.CONTACT_DETAILS, contactDetailsController.update)

  // No fixed abode
  get(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.view)
  post(paths.CONTACT_INFORMATION.NO_FIXED_ABODE, noFixedAbodeController.update)

  // Device wearer addresses
  get(paths.CONTACT_INFORMATION.ADDRESSES, addressController.view)
  post(paths.CONTACT_INFORMATION.ADDRESSES, addressController.update)

  // Device wearer addresses
  get(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, notifyingOrganisationController.view)
  post(paths.CONTACT_INFORMATION.INTERESTED_PARTIES, notifyingOrganisationController.update)

  /**
   * INSTALLATION AND RISK
   */
  get(paths.INSTALLATION_AND_RISK, installationAndRiskController.view)
  post(paths.INSTALLATION_AND_RISK, installationAndRiskController.update)

  /**
   * MONITORING CONDITIONS
   */

  // Main monitoring conditions page
  get(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.view)
  post(paths.MONITORING_CONDITIONS.BASE_URL, monitoringConditionsController.update)

  get(paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS, addressController.view)
  post(paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS, addressController.update)

  // Trail monitoring page
  get(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.TRAIL, trailMonitoringController.update)

  // Attendance monitoring page
  get(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.new)
  get(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE, attendanceMonitoringController.create)
  post(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM, attendanceMonitoringController.update)

  // Alcohol monitoring page
  get(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.view)
  post(paths.MONITORING_CONDITIONS.ALCOHOL, alcoholMonitoringController.update)

  // Curfew day of release page
  get(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, curfewReleaseDateController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE, curfewReleaseDateController.update)

  // Curfew conditions page
  get(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS, curfewConditionsController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS, curfewConditionsController.update)

  // Curfew dates page
  get(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.view)
  post(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE, curfewTimetableController.update)

  // Exclusion Inclusion Zone
  get(paths.MONITORING_CONDITIONS.ZONE, zoneController.view)
  post(paths.MONITORING_CONDITIONS.ZONE, zoneController.update)
  /**
   * ATTACHMENTS
   */
  get(paths.ATTACHMENT.ATTACHMENTS, attachmentsController.view)
  get(paths.ATTACHMENT.LICENCE, attachmentsController.licence)
  post(paths.ATTACHMENT.LICENCE, attachmentsController.uploadLicence)
  get(paths.ATTACHMENT.PHOTO_ID, attachmentsController.photo)
  post(paths.ATTACHMENT.PHOTO_ID, attachmentsController.uploadPhoto)
  get(paths.ATTACHMENT.DOWNLOAD_LICENCE, attachmentsController.downloadLicence)
  get(paths.ATTACHMENT.DOWNLOAD_PHOTO_ID, attachmentsController.downloadPhoto)

  // RECEIPT

  get('/order/:orderId/receipt', async (req, res, next) => {
    // Path to the HTML template
    const htmlPath = path.join(
      __dirname,
      '../../../../hmpps-electronic-monitoring-create-an-order/server/views/pages/receipt.html',
    )

    // Read the HTML file
    fs.readFile(htmlPath, 'utf8', (err, html) => {
      if (err) {
        console.error('Error reading HTML file:', err)
        return res.status(500).send('Failed to generate PDF')
      }

      // Generate PDF from HTML
      pdf
        .create(html, {
          format: 'A4',
          orientation: 'portrait',
          border: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        })
        .toBuffer((error, buffer) => {
          if (error) {
            console.error('Error generating PDF:', err)
            return res.status(500).send('Failed to generate PDF')
          }

          // Set response headers to indicate a PDF file
          res.setHeader('Content-Type', 'application/pdf')
          res.setHeader('Content-Disposition', `attachment; filename="user_answers.pdf"`)

          // Send the PDF buffer as the response
          res.send(buffer)
        })
    })
  })

  return router
}
