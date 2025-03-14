import DeviceWearerPageContent from '../../../types/i18n/pages/deviceWearer'

const deviceWearerPageContent: DeviceWearerPageContent = {
  helpText: '',
  legend: '',
  questions: {
    adultAtTimeOfInstallation: {
      text: 'Is a responsible adult required?',
      hint: 'If the device wearer is under 18, a responsible adult must attend installation. A responsible adult is a parent, guardian or someone with parental rights.',
    },
    alias: {
      text: "What is the device wearer's preferred name or names? (optional)",
      hint: "Enter names the device wearer chooses to use. Include nicknames and aliases that are different to the device wearer's first name.",
    },
    dateOfBirth: {
      text: "What is the device wearer's date of birth?",
    },
    disabilities: {
      text: 'Does the device wearer have any of the disabilities or health conditions listed? (optional)',
      hint: 'Select all that apply',
    },
    firstName: {
      text: "What is the device wearer's first name?",
    },
    gender: {
      text: "What is the device wearer's gender?",
      hint: 'Gender can be different to their sex registered at birth.',
    },
    interpreterRequired: {
      text: 'Is an interpreter needed?',
      hint: "Interpreter's are required when the device wearer's main language isn't English",
    },
    language: {
      text: 'What language does the interpreter need to use? (optional)',
      hint: 'Select the language the device wearer is most comfortable using.',
    },
    lastName: {
      text: "What is the device wearer's last name?",
    },
    otherDisability: {
      text: '',
    },
    sex: {
      text: 'What is the sex of the device wearer?',
      hint: "Select the sex recorded on the device wearer's birth certificate.",
    },
  },
  section: 'About the device wearer',
  title: 'Personal details',
}

export default deviceWearerPageContent
