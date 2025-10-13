const paths = {
  ORDER: {
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

  MONITORING_CONDITIONS: {
    BASE_URL: '/order/:orderId/monitoring-conditions',
    INSTALLATION_LOCATION: '/order/:orderId/monitoring-conditions/installation-location',
    INSTALLATION_APPOINTMENT: '/order/:orderId/monitoring-conditions/installation-appointment',
    INSTALLATION_ADDRESS: '/order/:orderId/monitoring-conditions/:addressType(installation)',
    TRAIL: '/order/:orderId/monitoring-conditions/trail',
    ZONE: '/order/:orderId/monitoring-conditions/zone/:zoneId',
    ATTENDANCE: '/order/:orderId/monitoring-conditions/attendance',
    ATTENDANCE_ITEM: '/order/:orderId/monitoring-conditions/attendance/:conditionId',
    ALCOHOL: '/order/:orderId/monitoring-conditions/alcohol',
    CURFEW_RELEASE_DATE: '/order/:orderId/monitoring-conditions/curfew/release-date',
    CURFEW_CONDITIONS: '/order/:orderId/monitoring-conditions/curfew/conditions',
    CURFEW_ADDITIONAL_DETAILS: '/order/:orderId/monitoring-conditions/curfew/additional-details',
    CURFEW_TIMETABLE: '/order/:orderId/monitoring-conditions/curfew/timetable',
    CHECK_YOUR_ANSWERS: '/order/:orderId/monitoring-conditions/check-your-answers',
    ORDER_TYPE_DESCRIPTION: {
      BASE_PATH: '/order/:orderId/monitoring-conditions/order-type-description',
      ORDER_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/order-type',
      SENTENCE_TYPE: '/order/:orderId/monitoring-conditions/order-type-description/sentence-type',
      HDC: '/order/:orderId/monitoring-conditions/order-type-description/hdc',
      ISS: '/order/:orderId/monitoring-conditions/order-type-description/iss',
      PRARR: '/order/:orderId/monitoring-conditions/order-type-description/prarr',
      MONITORING_DATES: '/order/:orderId/monitoring-conditions/order-type-description/monitoring-dates',
      CHECK_YOUR_ANSWERS: '/order/:orderId/monitoring-conditions/order-type-description/check-your-answers',
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
  },
}

export default paths
