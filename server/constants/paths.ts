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

  ATTACHMENT: {
    ATTACHMENTS: '/order/:orderId/attachments',
    LICENCE: '/order/:orderId/attachments/licence',
    PHOTO_ID: '/order/:orderId/attachments/photoId',
    DOWNLOAD_LICENCE: '/order/:orderId/attachments/licence/:filename',
    DOWNLOAD_PHOTO_ID: '/order/:orderId/attachments/photoId/:filename',
  },
}

export default paths
