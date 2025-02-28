import * as util from 'util'
import { getMockOrder } from '../testutils/mockOrder'
import DeviceWearerNamesPage from './pages/device-wearer'
import PageRenderer from './renderers/page'
import AboutTheDeviceWearerSection from './sections/about-the-device-wearer'
import DeviceWearerNamesPageRenderer from './renderers/device-wearer-names'

const order = getMockOrder()
// const renderer = new PageRenderer()
const renderer = new DeviceWearerNamesPageRenderer()
const page = new DeviceWearerNamesPage(order)
const section = new AboutTheDeviceWearerSection(order)

const viewModel = renderer.render(page)

console.log(util.inspect(viewModel, false, null, true))
