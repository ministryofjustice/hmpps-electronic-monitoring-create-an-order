export type OSDataHubAddress = {
  DPA: {
    ORGANISATION_NAME?: string
    BUILDING_NUMBER?: number
    BUILDING_NAME?: string
    THOROUGHFARE_NAME?: string
    SUB_BUILDING_NAME?: string
    POST_TOWN?: string
    LOCAL_CUSTODIAN_CODE_DESCRIPTION?: string
    POSTCODE: string
    UPRN: string
  }
}

export type OSDataHubPostcodeResponse = {
  results: OSDataHubAddress[]
}
