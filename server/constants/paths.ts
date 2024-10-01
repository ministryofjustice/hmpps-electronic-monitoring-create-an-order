const paths = {
  ORDER: {
    CREATE: '/order/create',
    DELETE: '/order/:orderId/delete',
    DELETE_FAILED: '/order/delete/failed',
    DELETE_SUCCESS: '/order/delete/success',
    SUMMARY: '/order/:orderId/summary',
  },

  ABOUT_THE_DEVICE_WEARER: {
    DEVICE_WEARER: '/order/:orderId/about-the-device-wearer',
    CONTACT_DETAILS: '/order/:orderId/about-the-device-wearer/contact-details',
    RESPONSIBLE_ADULT: '/order/:orderId/about-the-device-wearer/responsible-adult',
  },
}

export default paths
