const paths = {
  ORDER: {
    CREATE: '/order/create',
    DELETE: '/order/:orderId/delete',
    DELETE_FAILED: '/order/delete/failed',
    DELETE_SUCCESS: '/order/delete/success',
    SUMMARY: '/order/:orderId/summary',
    SUBMIT: '/order/:orderId/submit',
    SUBMIT_FAILED: '/order/submit/failed',
    SUBMIT_SUCCESS: '/order/submit/success',
  },

  ABOUT_THE_DEVICE_WEARER: {
    CHECK_YOUR_ANSWERS: '/order/:orderId/about-the-device-wearer/check-your-answers',
    DEVICE_WEARER: '/order/:orderId/about-the-device-wearer',
    RESPONSIBLE_ADULT: '/order/:orderId/about-the-device-wearer/responsible-adult',
    RESPONSIBLE_OFFICER: '/order/:orderId/about-the-device-wearer/responsible-officer',
  },

  CONTACT_INFORMATION: {
    CONTACT_DETAILS: '/order/:orderId/contact-information/contact-details',
    ADDRESSES: '/order/:orderId/contact-information/addresses',
  },

  INSTALLATION_AND_RISK: '/order/:orderId/installation-and-risk',

  MONITORING_CONDITIONS: {
    BASE_URL: '/order/:orderId/monitoring-conditions',
    TRAIL: '/order/:orderId/monitoring-conditions/trail',
    ZONE: '/order/:orderId/monitoring-conditions/zone/:zoneId',
    ATTENDANCE: '/order/:orderId/monitoring-conditions/attendance',
    ATTENDANCE_ITEM: '/order/:orderId/monitoring-conditions/attendance/:conditionId',
    ALCOHOL: '/order/:orderId/monitoring-conditions/alcohol',
    CURFEW_RELEASE_DATE: '/order/:orderId/monitoring-conditions/curfew/release-date',
    CURFEW_DATES: '/order/:orderId/monitoring-conditions/curfew/dates',
    CURFEW_TIMETABLE: '/order/:orderId/monitoring-conditions/curfew/timetable',
  },

  ATTACHMENT: {
    ATTACHMENTS: '/order/:orderId/attachments',
    LICENCE: '/order/:orderId/attachments/licence',
    PHOTO_ID: '/order/:orderId/attachments/photoId',
    DOWNLOAD_LICENCE: '/order/:orderId/attachments/licence/:filename',
    DOWNLOAD_PHOTO_ID: '/order/:orderId/attachments/photoId/:filename',
  },
}

export default paths
