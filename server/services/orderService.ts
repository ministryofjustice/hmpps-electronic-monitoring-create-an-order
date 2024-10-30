import puppeteer from 'puppeteer'
import { readFile } from 'node:fs/promises'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import OrderModel, { Order } from '../models/Order'
import { SanitisedError } from '../sanitisedError'

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class OrderService {
  constructor(private readonly apiClient: RestClient) {}

  async createOrder(input: AuthenticatedRequestInput): Promise<Order> {
    const result = await this.apiClient.post({
      path: '/api/orders',
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }

  async getOrder(input: OrderRequestInput): Promise<Order> {
    const result = await this.apiClient.get({
      path: `/api/orders/${input.orderId}`,
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }

  async downloadReceipt(input: OrderRequestInput): Promise<Buffer> {
    const url = `http://localhost:3000/order/${input.orderId}/receipt/view`

    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // Navigate to the webpage
      await page.goto(url, { waitUntil: 'networkidle0' })

      // Create the PDF
      const bufferArray = await page.pdf({
        format: 'A4',
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      })

      const buffer = Buffer.from(bufferArray)

      await browser.close()
      return buffer // Return the generated PDF buffer
    } catch (err) {
      console.error('Error generating PDF from webpage:', err)
      throw err // Propagate the error up the call stack
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteOrder(input: OrderRequestInput) {
    // Do nothing for now
    return Promise.resolve()
  }

  async submitOrder(input: OrderRequestInput) {
    try {
      const result = await this.apiClient.post({
        path: `/api/orders/${input.orderId}/submit`,
        token: input.accessToken,
      })

      return result
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return e as SanitisedError
      }

      throw e
    }
  }
}
