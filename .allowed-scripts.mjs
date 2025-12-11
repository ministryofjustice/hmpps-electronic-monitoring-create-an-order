import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
      "node_modules/cypress@14.5.4": "ALLOW",
   },
})
