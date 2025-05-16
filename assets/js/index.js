import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()
initAll()

// Receipt download
const downloadButton = document.getElementById('download-pdf')
if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    window.print()
  })
}

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

function initAll() {  
  const $spinnerForms = document.querySelectorAll('[data-module="form-spinner"]')
  nodeListForEach($spinnerForms, function ($spinnerForm) {
    new FormSpinner($spinnerForm)
  })
}
function FormSpinner(container) {
  this.container = container

  this.spinnerSvg =
    '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

  this.container.addEventListener('submit', () => {
    const formSpinnerTemplate = document.createElement('template')
    formSpinnerTemplate.innerHTML = `
      <div class="form-spinner">
        <div class="form-spinner__notification-box" role="alert">
          ${this.container.dataset.loadingText ?? 'Submitting'}
          <div class="form-spinner__spinner">
            ${this.spinnerSvg}
          </div>
        </div>
      </div>
    `.trim()

    setTimeout(() => document.querySelector('body').appendChild(formSpinnerTemplate.content.firstChild), 1000)

    const buttons = this.container.querySelectorAll('[data-module="govuk-button"]')
    nodeListForEach(buttons, function (button) {
      button.setAttribute('disabled', 'disabled')
      button.setAttribute('aria-disabled', 'true')
    })
  })
}