const paths = {
  ORDER: {
    BASE_URL: '/order/:orderId',
    CREATE: '/order/create',
    DELETE: '/order/:orderId/delete',
    DELETE_FAILED: '/order/delete/failed',
    DELETE_SUCCESS: '/order/delete/success',
    SUMMARY: '/order/:orderId/summary',
    SUBMIT: '/order/:orderId/submit',
    SUBMIT_FAILED: '/order/:orderId/submit/failed',
    SUBMIT_PATIAL_SUCCESS: '/order/:orderId/submit/partial-success',
    SUBMIT_SUCCESS: '/order/:orderId/submit/success',
    RECEIPT: '/order/:orderId/receipt',
    RECEIPT_DOWNLOAD: '/order/:orderId/pdf',
    EDIT: '/order/:orderId/edit',
    IS_REJECTION: '/order/:orderId/is-rejection',
    VARIATION: '/order/:orderId/variation',
  },

  ABOUT_THE_DEVICE_WEARER: {
    CHECK_YOUR_ANSWERS: '/order/:orderId/about-the-device-wearer/check-your-answers',
    DEVICE_WEARER: '/order/:orderId/about-the-device-wearer',
    RESPONSIBLE_ADULT: '/order/:orderId/about-the-device-wearer/responsible-adult',
    IDENTITY_NUMBERS: '/order/:orderId/about-the-device-wearer/identity-numbers',
  },

  CONTACT_INFORMATION: {
    CHECK_YOUR_ANSWERS: '/order/:orderId/contact-information/check-your-answers',
    CONTACT_DETAILS: '/order/:orderId/contact-information/contact-details',
    NO_FIXED_ABODE: '/order/:orderId/contact-information/no-fixed-abode',
    ADDRESSES: '/order/:orderId/contact-information/addresses/:addressType(primary|secondary|tertiary)',
    INTERESTED_PARTIES: '/order/:orderId/contact-information/interested-parties',
    PROBATION_DELIVERY_UNIT: '/order/:orderId/contact-information/probation-delivery-unit',
  },

  INSTALLATION_AND_RISK: {
    INSTALLATION_AND_RISK: '/order/:orderId/installation-and-risk',
    CHECK_YOUR_ANSWERS: '/order/:orderId/installation-and-risk/check-your-answers',
  },

  POSTCODE_LOOKUP: {
    FIND_ADDRESS: '/order/:orderId/find-address/:addressType',
    ADDRESS_RESULT: '/order/:orderId/address-result/:addressType',
    CONFIRM_ADDRESS: '/order/:orderId/confirm-address/:addressType',
    ENTER_ADDRESS: '/order/:orderId/enter-address/:addressType',
    ADDRESS_LIST: '/order/:orderId/address-list',
  },

  MONITORING_CONDITIONS: {
    INSTALLATION_LOCATION: '/order/:orderId/monitoring-conditions/installation-location',
    INSTALLATION_APPOINTMENT: '/order/:orderId/monitoring-conditions/installation-appointment',
    INSTALLATION_ADDRESS: '/order/:orderId/monitoring-conditions/:addressType(installation)',
    TRAIL: '/order/:orderId/monitoring-conditions/trail',
    ZONE: '/order/:orderId/monitoring-conditions/zone/:zoneId',

    ZONE_NEW_ITEM: '/order/:orderId/monitoring-conditions/add-to-list/zone',
    ZONE_ADD_TO_LIST: '/order/:orderId/monitoring-conditions/add-to-list/zone/:zoneId',
    ATTENDANCE: '/order/:orderId/monitoring-conditions/attendance',
    ATTENDANCE_ADD_TO_LIST: '/order/:orderId/monitoring-conditions/add-to-list/attendance',
    ATTENDANCE_ITEM: '/order/:orderId/monitoring-conditions/attendance/:conditionId',
    ATTENDANCE_ITEM_ADD_TO_LIST: '/order/:orderId/monitoring-conditions/add-to-list/attendance/:conditionId',
    ALCOHOL: '/order/:orderId/monitoring-conditions/alcohol',
    CURFEW_RELEASE_DATE: '/order/:orderId/monitoring-conditions/curfew/release-date',
    CURFEW_CONDITIONS: '/order/:orderId/monitoring-conditions/curfew/conditions',
    CURFEW_ADDITIONAL_DETAILS: '/order/:orderId/monitoring-conditions/curfew/additional-details',
    CURFEW_TIMETABLE: '/order/:orderId/monitoring-conditions/curfew/timetable',
    CHECK_YOUR_ANSWERS: '/order/:orderId/monitoring-conditions/check-your-answers',
    REMOVE_MONITORING_TYPE: '/order/:orderId/monitoring-condtions/remove-monitoring-type/:monitoringTypeId',
    ORDER_TYPE_DESCRIPTION: {
      BASE_PATH: '/order/:orderId/monitoring-conditions/order-type-description',
      ORDER_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/order-type',
      SENTENCE_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/sentence-type',
      HDC: '/order/:orderId/monitoring-conditions/order-type-description/hdc',
      ISSP: '/order/:orderId/monitoring-conditions/order-type-description/issp',
      PRARR: '/order/:orderId/monitoring-conditions/order-type-description/prarr',
      POLICE_AREA: '/order/:orderId/monitoring-conditions/order-type-description/police-area',

      PILOT: '/order/:orderId/monitoring-conditions/order-type-description/pilot',
      MONITORING_TYPES: '/order/:orderId/monitoring-conditions/order-type-description/monitoring-types',
      MONITORING_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/monitoring-type',
      TYPES_OF_MONITORING_NEEDED:
        '/order/:orderId/monitoring-conditions/order-type-description/types-of-monitoring-needed',
      OFFENCE_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/offence-type',
    },
  },

  ATTACHMENT: {
    ATTACHMENTS: '/order/:orderId/attachments',
    FILE_VIEW: '/order/:orderId/attachments/:fileType(photo_Id|licence)',
    DOWNLOAD_FILE: '/order/:orderId/attachments/:fileType(photo_Id|licence)/:filename',
    DELETE_FILE: '/order/:orderId/attachments/:fileType(photo_Id|licence)/delete',
    HAVE_PHOTO: '/order/:orderId/attachments/have-photo',
  },

  VARIATION: {
    VARIATION_DETAILS: '/order/:orderId/variation/details',
    SERVICE_REQUEST_TYPE: '/order/:orderId/service-request-type',
    CREATE_VARIATION: '/order/create-variation',
  },
}

export default paths
