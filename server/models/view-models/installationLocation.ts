import { ViewModel, TextField } from './utils'

type InstallationLocationViewModel = ViewModel<object> & {
  primaryAddressView: TextField
}

const construct = (): InstallationLocationViewModel => {
  return {
    primaryAddressView: { value: '' },
    errorSummary: null,
  }
}

export default {
  construct,
}
