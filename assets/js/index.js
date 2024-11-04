import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import html2pdf from 'html2pdf.js'

govukFrontend.initAll()
mojFrontend.initAll()

// Receipt download
const downloadButton = document.getElementById('download-pdf')
if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    const element = document.getElementById('receipt')
    if (element) {
      const opt = {
        margin: [50, 30, 30, 30],
        filename: 'order-receipt.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      }

      html2pdf().from(element).set(opt).save()
    }

    // OR: window.print()
  })
}