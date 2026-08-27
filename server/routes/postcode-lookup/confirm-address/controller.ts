import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType, AddressWithoutType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import TaskListService from '../../../services/taskListService'
import AddressService from '../../../services/addressService'
import DeviceWearerService from '../../../services/deviceWearerService'
import { SanitisedError } from '../../../sanitisedError'
import CorePersonRecordService from '../core-person-record/service'

export default class ConfirmAddressController {
  constructor(
    private readonly postcodeService: PostcodeService,
    private readonly tasklistService: TaskListService,
    private readonly corePersonRecordService: CorePersonRecordService,
    private readonly addressService: AddressService,
    private readonly deviceWearerService: DeviceWearerService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const addressType = req.params.addressType as AddressType
    const postcode = req.query.postcode as string
    const buildingId = req.query.buildingId as string | undefined
    const organisationSearchId = this.getOrganisationSearchId(req)

    let address = order.addresses.find(item => item.addressType === addressType) as AddressWithoutType | undefined

    if (organisationSearchId) {
      try {
        address = await this.getCorePersonPrimaryAddress(req, res, organisationSearchId)
      } catch (error) {
        if ((error as SanitisedError).status !== 404) {
          throw error
        }
      }

      if (!address) {
        res.redirect(paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id))
        return
      }
    }

    if (!address) {
      res.send(404)
      return
    }

    const useDifferentAddressLink =
      postcode === undefined
        ? paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType)
        : this.postcodeService.buildUrl(
            paths.POSTCODE_LOOKUP.ADDRESS_RESULT,
            order.id,
            addressType,
            postcode,
            buildingId,
          )

    const model = Model.construct(address, res.locals.content as I18n, {
      orderId: order.id,
      addressType,
      postcode,
      buildingId,
      useDifferentAddressLink,
      isCorePersonRecordAddress: Boolean(organisationSearchId),
      noFixedAddressLink: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
    })

    res.render('pages/order/postcode-lookup/confirm-address', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const addressType = (req.params.addressType as string).toUpperCase()
    const organisationSearchId = this.getOrganisationSearchId(req)

    const { action } = req.body

    if (action === 'continue') {
      if (organisationSearchId) {
        let address: AddressWithoutType | undefined

        try {
          address = await this.getCorePersonPrimaryAddress(req, res, organisationSearchId)
        } catch (error) {
          if ((error as SanitisedError).status !== 404) {
            throw error
          }
        }

        if (!address) {
          res.redirect(paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id))
          return
        }

        await this.addressService.updateAddress({
          accessToken: res.locals.user.token,
          orderId: order.id,
          data: { ...address, addressType },
        })
        await this.deviceWearerService.updateNoFixedAbode({
          accessToken: res.locals.user.token,
          orderId: order.id,
          data: { noFixedAbode: false },
        })
      }

      if (addressType === 'INSTALLATION') {
        res.redirect(this.tasklistService.getNextPage('INSTALLATION_ADDRESS', order))
        return
      }

      res.redirect(paths.POSTCODE_LOOKUP.ADDRESS_LIST.replace(':orderId', order.id))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }

  private getOrganisationSearchId(req: Request): string | undefined {
    return typeof req.query.organisationSearchId === 'string' ? req.query.organisationSearchId : undefined
  }

  private async getCorePersonPrimaryAddress(
    req: Request,
    res: Response,
    organisationSearchId: string,
  ): Promise<AddressWithoutType | undefined> {
    const details = await this.corePersonRecordService.getPersonDetails({
      accessToken: res.locals.user.token,
      orderId: req.order!.id,
      organisationSearchId,
    })

    return details.addresses.find(address => address.addressType === 'PRIMARY')
  }
}
