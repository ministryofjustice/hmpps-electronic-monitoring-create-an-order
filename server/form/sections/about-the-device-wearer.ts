import { Order } from '../../models/Order'
import DeviceWearerNamesPage from '../pages/device-wearer'
import Page from '../pages/page'
import Section from './section'

class AboutTheDeviceWearerSection implements Section {
  title = 'About the device wearer'

  constructor(private readonly order: Order) {}

  get namesPage(): Page {
    return new DeviceWearerNamesPage(this.order)
  }

  get pages(): Array<Page> {
    return [this.namesPage]
  }
}

export default AboutTheDeviceWearerSection
