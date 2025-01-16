import { getMatchingRequests } from '../mockApis/wiremock'

type GetMatchingFmsAttachmentRequestOptions = {
  sysId: string
  fileName: string
  fileContent: string
}

// eslint-disable-next-line import/prefer-default-export
export const getMatchingFmsAttachmentRequests = (options: GetMatchingFmsAttachmentRequestOptions) => {
  return getMatchingRequests({
    urlPath: '/fms/now/v1/attachment_csm/file',
    queryParameters: {
      table_name: {
        equalTo: 'x_serg2_ems_csm_sr_mo_new',
      },
      table_sys_id: {
        equalTo: options.sysId,
      },
      file_name: {
        equalTo: options.fileName,
      },
    },
    bodyPatterns: [
      {
        equalTo: JSON.stringify(options.fileContent),
      },
    ],
  }).then(response => response.body.requests)
}
