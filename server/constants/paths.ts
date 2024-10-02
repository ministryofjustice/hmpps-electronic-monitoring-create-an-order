const paths = {
  ORDER: {
    CREATE: '/order/create',
    DELETE: '/order/:orderId/delete',
    DELETE_FAILED: '/order/delete/failed',
    DELETE_SUCCESS: '/order/delete/success',
    SUMMARY: '/order/:orderId/summary',
  },

  ABOUT_THE_DEVICE_WEARER: {
    CHECK_YOUR_ANSWERS: '/order/:orderId/about-the-device-wearer/check-your-answers',
    CONTACT_DETAILS: '/order/:orderId/about-the-device-wearer/contact-details',
    DEVICE_WEARER: '/order/:orderId/about-the-device-wearer',
    DEVICE_WEARER_CONTACT_DETAILS: '/order/:orderId/about-the-device-wearer/device-wearer-contact-details',
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
