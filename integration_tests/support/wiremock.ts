import { getMatchingRequests } from '../mockApis/wiremock'

// eslint-disable-next-line import/prefer-default-export
export const getFmsAttachmentRequests = () => {
  return getMatchingRequests({
    urlPath: '/fms/now/v1/attachment_csm/file',
  }).then(response => response.body.requests)
}
