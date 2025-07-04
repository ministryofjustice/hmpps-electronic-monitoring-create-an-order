import { HmppsUser } from '../../interfaces/hmppsUser'
import { Order } from '../../models/Order'
import I18n from '../../types/i18n'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      flash(type: string, message: unknown): number
      order?: Order
    }

    interface Response {
      renderPdf(pageView: string, pageData: PdfPageData, options: { filename: string; pdfMargins: PdfMargins }): void
    }

    interface Locals {
      user: HmppsUser
      isOrderEditable?: boolean
      orderId?: string
      content?: I18n
    }
  }
}
