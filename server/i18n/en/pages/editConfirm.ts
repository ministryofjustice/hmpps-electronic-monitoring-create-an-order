import ConfirmationPageContent from '../../../types/i18n/pages/confirmationPage'

const editConfirmPageContent: ConfirmationPageContent = {
  title: 'Confirm edit application',
  heading: 'Are you sure that you want to make changes to the EMO application form for',
  helpText: [
    'Check and update the licence or court order before making changes to the EMO application form.',
    "You can make changes to the EMO application form now if the information you are changing isn't included in the licence or court order.",
  ],
  buttons: {
    confirm: 'Yes, make changes',
    cancel: 'Cancel and return back to form',
  },
}

export default editConfirmPageContent
