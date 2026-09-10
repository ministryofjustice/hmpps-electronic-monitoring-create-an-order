// Shared path fragments used to compose the route constants below.
// Composing from these bases keeps a single source of truth for each URL segment and
// lets sub-routers derive their own relative routes from the same constants (see
// `relativePath` in server/routes/routeHelpers.ts) instead of duplicating literal strings.
//
// Every feature exposes a `BASE_URL` and, where its pages can also be viewed for a historic
// version of the order, a matching `BASE_URL_VERSION`. server/routes/index.ts mounts each
// feature router on both, so routes only ever need declaring once, relative to `BASE_URL`.
const ORDER_BASE = '/order/:orderId'
const ORDER_VERSION_BASE = `${ORDER_BASE}/version/:versionId`

const INTEREST_PARTIES_BASE = `${ORDER_BASE}/interest-parties`
const INTEREST_PARTIES_VERSION_BASE = `${ORDER_VERSION_BASE}/interest-parties`
const ABOUT_THE_DEVICE_WEARER_BASE = `${ORDER_BASE}/about-the-device-wearer`
const ABOUT_THE_DEVICE_WEARER_VERSION_BASE = `${ORDER_VERSION_BASE}/about-the-device-wearer`
const CONTACT_INFORMATION_BASE = `${ORDER_BASE}/contact-information`
const CONTACT_INFORMATION_VERSION_BASE = `${ORDER_VERSION_BASE}/contact-information`
const INSTALLATION_AND_RISK_BASE = `${ORDER_BASE}/installation-and-risk`
const INSTALLATION_AND_RISK_VERSION_BASE = `${ORDER_VERSION_BASE}/installation-and-risk`
const MONITORING_CONDITIONS_BASE = `${ORDER_BASE}/monitoring-conditions`
const MONITORING_CONDITIONS_VERSION_BASE = `${ORDER_VERSION_BASE}/monitoring-conditions`
const ORDER_TYPE_DESCRIPTION_BASE = `${MONITORING_CONDITIONS_BASE}/order-type-description`
const ATTACHMENT_BASE = `${ORDER_BASE}/attachments`
const ATTACHMENT_VERSION_BASE = `${ORDER_VERSION_BASE}/attachments`

const paths = {
  ORDER: {
    BASE_URL: ORDER_BASE,
    BASE_URL_VERSION: ORDER_VERSION_BASE,
    CREATE: '/order/create',
    DELETE: `${ORDER_BASE}/delete`,
    DELETE_FAILED: '/order/delete/failed',
    DELETE_SUCCESS: '/order/delete/success',
    SUMMARY: `${ORDER_BASE}/summary`,
    SUMMARY_VERSION: `${ORDER_VERSION_BASE}/summary`,
    SUBMIT: `${ORDER_BASE}/submit`,
    SUBMIT_FAILED: `${ORDER_BASE}/submit/failed`,
    SUBMIT_PARTIAL_SUCCESS: `${ORDER_BASE}/submit/partial-success`,
    SUBMIT_SUCCESS: `${ORDER_BASE}/submit/success`,
    RECEIPT: `${ORDER_BASE}/receipt`,
    RECEIPT_VERSION: `${ORDER_VERSION_BASE}/receipt`,
    RECEIPT_DOWNLOAD: `${ORDER_BASE}/pdf`,
    DOWNLOAD_FMS_DW_REQUEST: `${ORDER_BASE}/fmsDeviceWearerRequests`,
    DOWNLOAD_FMS_MO_REQUEST: `${ORDER_BASE}/fmsMonitoringOrderRequests`,
    EDIT: `${ORDER_BASE}/edit`,
    IS_REJECTION: `${ORDER_BASE}/is-rejection`,
    IS_ADDRESS_CHANGE: `${ORDER_BASE}/is-address-change`,
    VARIATION: `${ORDER_BASE}/variation`,
    SPECIAL_ORDER: `${ORDER_BASE}/special-order`,
    NO_REFITS: '/order/no-refits',
    NO_CHANGE_RESPONSIBLE_OFFICER: '/order/no-change-responsible-officer',
    UPDATE_ORDER_OWNER: `${ORDER_BASE}/update-order-owner`,
  },

  INTEREST_PARTIES: {
    BASE_URL: INTEREST_PARTIES_BASE,
    BASE_URL_VERSION: INTEREST_PARTIES_VERSION_BASE,
    NOTIFYING_ORGANISATION: `${INTEREST_PARTIES_BASE}/notifying-organisation`,
    SENTENCING_ACT_SELECTION: `${INTEREST_PARTIES_BASE}/sentencing-act-selection`,
    RESPONSIBLE_OFFICER: `${INTEREST_PARTIES_BASE}/responsible-officer`,
    RESPONSIBLE_ORGANISATION: `${INTEREST_PARTIES_BASE}/responsible-organisation`,
    NSD: `${INTEREST_PARTIES_BASE}/national-security-directorate`,
    PDU: `${INTEREST_PARTIES_BASE}/probation-delivery-unit`,
    CHECK_YOUR_ANSWERS: `${INTEREST_PARTIES_BASE}/check-your-answers`,
    CHECK_YOUR_ANSWERS_VERSION: `${INTEREST_PARTIES_VERSION_BASE}/check-your-answers`,
  },

  ABOUT_THE_DEVICE_WEARER: {
    BASE_URL: ABOUT_THE_DEVICE_WEARER_BASE,
    BASE_URL_VERSION: ABOUT_THE_DEVICE_WEARER_VERSION_BASE,
    CHECK_YOUR_ANSWERS: `${ABOUT_THE_DEVICE_WEARER_BASE}/check-your-answers`,
    CHECK_YOUR_ANSWERS_VERSION: `${ABOUT_THE_DEVICE_WEARER_VERSION_BASE}/check-your-answers`,
    DEVICE_WEARER_SEARCH_RESULTS: `${ABOUT_THE_DEVICE_WEARER_BASE}/:identifyNumber/device-wearer-search-results`,
    RESPONSIBLE_ADULT: `${ABOUT_THE_DEVICE_WEARER_BASE}/responsible-adult`,
    IDENTITY_NUMBERS: `${ABOUT_THE_DEVICE_WEARER_BASE}/identity-numbers`,
  },

  CONTACT_INFORMATION: {
    BASE_URL: CONTACT_INFORMATION_BASE,
    BASE_URL_VERSION: CONTACT_INFORMATION_VERSION_BASE,
    CHECK_YOUR_ANSWERS: `${CONTACT_INFORMATION_BASE}/check-your-answers`,
    CHECK_YOUR_ANSWERS_VERSION: `${CONTACT_INFORMATION_VERSION_BASE}/check-your-answers`,
    CONTACT_DETAILS: `${CONTACT_INFORMATION_BASE}/contact-details`,
    NO_FIXED_ABODE: `${CONTACT_INFORMATION_BASE}/no-fixed-abode`,
    INTERESTED_PARTIES: `${CONTACT_INFORMATION_BASE}/interested-parties`,
    PROBATION_DELIVERY_UNIT: `${CONTACT_INFORMATION_BASE}/probation-delivery-unit`,
  },

  INSTALLATION_AND_RISK: {
    BASE_URL: INSTALLATION_AND_RISK_BASE,
    BASE_URL_VERSION: INSTALLATION_AND_RISK_VERSION_BASE,
    CHECK_YOUR_ANSWERS: `${INSTALLATION_AND_RISK_BASE}/check-your-answers`,
    CHECK_YOUR_ANSWERS_VERSION: `${INSTALLATION_AND_RISK_VERSION_BASE}/check-your-answers`,
    OFFENCE_NEW_ITEM: `${INSTALLATION_AND_RISK_BASE}/offence`,
    OFFENCE: `${INSTALLATION_AND_RISK_BASE}/offence/:offenceId`,
    OFFENCE_OTHER_INFO: `${INSTALLATION_AND_RISK_BASE}/offence-other-info`,
    OFFENCE_LIST: `${INSTALLATION_AND_RISK_BASE}/offence-list`,
    DAPO: `${INSTALLATION_AND_RISK_BASE}/dapo`,
    DAPO_ID: `${INSTALLATION_AND_RISK_BASE}/dapo/:clauseId`,
    DELETE: `${INSTALLATION_AND_RISK_BASE}/delete/:offenceId`,
    MAPPA: `${INSTALLATION_AND_RISK_BASE}/mappa`,
    IS_MAPPA: `${INSTALLATION_AND_RISK_BASE}/is-mappa`,
    DETAILS_OF_INSTALLATION: `${INSTALLATION_AND_RISK_BASE}/details-of-installation`,
  },

  POSTCODE_LOOKUP: {
    FIND_ADDRESS: `${ORDER_BASE}/find-address/:addressType`,
    ADDRESS_RESULT: `${ORDER_BASE}/address-result/:addressType`,
    CONFIRM_ADDRESS: `${ORDER_BASE}/confirm-address/:addressType`,
    ENTER_ADDRESS: `${ORDER_BASE}/enter-address/:addressType`,
    ADDRESS_LIST: `${ORDER_BASE}/address-list`,
  },

  MONITORING_CONDITIONS: {
    BASE_URL: MONITORING_CONDITIONS_BASE,
    BASE_URL_VERSION: MONITORING_CONDITIONS_VERSION_BASE,
    INSTALLATION_LOCATION: `${MONITORING_CONDITIONS_BASE}/installation-location`,
    INSTALLATION_APPOINTMENT: `${MONITORING_CONDITIONS_BASE}/installation-appointment`,
    TRAIL: `${MONITORING_CONDITIONS_BASE}/trail`,
    ZONE: `${MONITORING_CONDITIONS_BASE}/zone/:zoneId`,
    ZONE_NEW_ITEM: `${MONITORING_CONDITIONS_BASE}/add-to-list/zone/:zoneType`,
    ZONE_ADD_TO_LIST: `${MONITORING_CONDITIONS_BASE}/add-to-list/zone/:zoneType/:zoneId`,
    ATTENDANCE: `${MONITORING_CONDITIONS_BASE}/attendance`,
    ATTENDANCE_ADD_TO_LIST: `${MONITORING_CONDITIONS_BASE}/add-to-list/attendance`,
    ATTENDANCE_ITEM: `${MONITORING_CONDITIONS_BASE}/attendance/:conditionId`,
    ATTENDANCE_ITEM_ADD_TO_LIST: `${MONITORING_CONDITIONS_BASE}/add-to-list/attendance/:conditionId`,
    ALCOHOL: `${MONITORING_CONDITIONS_BASE}/alcohol`,
    CURFEW_RELEASE_DATE: `${MONITORING_CONDITIONS_BASE}/curfew/release-date`,
    CURFEW_CONDITIONS: `${MONITORING_CONDITIONS_BASE}/curfew/conditions`,
    CURFEW_ADDITIONAL_DETAILS: `${MONITORING_CONDITIONS_BASE}/curfew/additional-details`,
    CURFEW_TIMETABLE: `${MONITORING_CONDITIONS_BASE}/curfew/timetable`,
    CHECK_YOUR_ANSWERS: `${MONITORING_CONDITIONS_BASE}/check-your-answers`,
    CHECK_YOUR_ANSWERS_VERSION: `${MONITORING_CONDITIONS_VERSION_BASE}/check-your-answers`,
    REMOVE_MONITORING_TYPE: `${MONITORING_CONDITIONS_BASE}/remove-monitoring-type/:monitoringTypeId`,
    ORDER_TYPE_DESCRIPTION: {
      ORDER_TYPE: `${ORDER_TYPE_DESCRIPTION_BASE}/order-type`,
      SENTENCE_TYPE: `${ORDER_TYPE_DESCRIPTION_BASE}/sentence-type`,
      HDC: `${ORDER_TYPE_DESCRIPTION_BASE}/hdc`,
      HDC_PAUSE: `${ORDER_TYPE_DESCRIPTION_BASE}/hdc-pause`,
      ISSP: `${ORDER_TYPE_DESCRIPTION_BASE}/issp`,
      PRARR: `${ORDER_TYPE_DESCRIPTION_BASE}/prarr`,
      POLICE_AREA: `${ORDER_TYPE_DESCRIPTION_BASE}/police-area`,
      PILOT: `${ORDER_TYPE_DESCRIPTION_BASE}/pilot`,
      PATHFINDER_PROGRAMME: `${ORDER_TYPE_DESCRIPTION_BASE}/pathfinder-programme`,
      DAPOL_MISSED_IN_ERROR: `${ORDER_TYPE_DESCRIPTION_BASE}/dapol-missed-in-error`,
      MONITORING_TYPE: `${ORDER_TYPE_DESCRIPTION_BASE}/monitoring-type`,
      TYPES_OF_MONITORING_NEEDED: `${ORDER_TYPE_DESCRIPTION_BASE}/types-of-monitoring-needed`,
      OFFENCE_TYPE: `${ORDER_TYPE_DESCRIPTION_BASE}/offence-type`,
      HARD_STOP: `${ORDER_TYPE_DESCRIPTION_BASE}/hard-stop`,
    },
  },

  ATTACHMENT: {
    BASE_URL: ATTACHMENT_BASE,
    BASE_URL_VERSION: ATTACHMENT_VERSION_BASE,
    FILE_VIEW: `${ATTACHMENT_BASE}/:fileType(photo_Id|licence|court_order)`,
    DOWNLOAD_FILE: `${ATTACHMENT_BASE}/:fileType(photo_Id|licence|court_order)/:filename`,
    DELETE_FILE: `${ATTACHMENT_BASE}/:fileType(photo_Id|licence|court_order)/delete`,
    HAVE_PHOTO: `${ATTACHMENT_BASE}/have-photo`,
    HAVE_COURT_ORDER: `${ATTACHMENT_BASE}/have-court-order`,
  },

  VARIATION: {
    VARIATION_DETAILS: `${ORDER_BASE}/variation/details`,
    VARIATION_DETAILS_VERSION: `${ORDER_VERSION_BASE}/variation/details`,
    SERVICE_REQUEST_TYPE: `${ORDER_BASE}/service-request-type`,
    CREATE_VARIATION: '/order/create-variation',
  },
}

export default paths
