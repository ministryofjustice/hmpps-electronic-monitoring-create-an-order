import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

// Receipt download
const downloadButton = document.getElementById('download-pdf')
if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    window.print()
  })
}

const backButton = document.getElementsByClassName('govuk-back-link')[0]
if(backButton) {
  backButton.addEventListener('click', () => {
    window.history.back()
  })
}