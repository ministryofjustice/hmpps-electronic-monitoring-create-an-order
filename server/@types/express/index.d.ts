import { HmppsUser } from '../../interfaces/hmppsUser'
import { FormData } from '../../interfaces/formData'
import { Order } from '../../models/Order'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    formData: FormData
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
      order?: Order
    }

    interface Locals {
      user: HmppsUser
      isOrderEditable?: boolean
      orderId?: string
    }
  }
}
