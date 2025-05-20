interface ValidationErrors {
  attachments: {
    licenceRequired: string
    photoIdentityRequired: string
  }
  deviceWearer: {
    dateOfBirth: DateErrorMessages
    firstNameRequired: string
    genderRequired: string
    interpreterRequired: string
    languageRequired: string
    lastNameRequired: string
    responsibleAdultRequired: string
    sexRequired: string
  }
  monitoringConditions: {
    conditionTypeRequired: string
    monitoringTypeRequired: string
    orderTypeRequired: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
  }
  notifyingOrganisation: {
    notifyingOrganisationName: string
    responsibleOrganisation: string
  }
  variationDetails: {
    variationDate: DateErrorMessages
    variationTypeRequired: string
  }
}

export interface DateErrorMessages {
  mustBeInPast?: string
  mustBeReal: string
  mustIncludeDay: string
  mustIncludeMonth: string
  mustIncludeYear: string
  required?: string
  yearMustIncludeFourNumbers: string
}

interface TimeErrorMessages {
  mustBeReal: string
  mustIncludeHour: string
  mustIncludeMinute: string
  required?: string
}

export interface DateTimeErrorMessages {
  date: DateErrorMessages
  time: TimeErrorMessages
}

const validationErrors: ValidationErrors = {
  attachments: {
    licenceRequired: 'Select the licence document',
    photoIdentityRequired: 'Select the photo identification document',
  },
  deviceWearer: {
    // might be best to make these a sub object in case of multiple, different date validations
    dateOfBirth: {
      mustBeInPast: 'Date of birth must be in the past',
      mustBeReal: 'Date of birth must be a real date',
      mustIncludeDay: 'Date of birth must include a day',
      mustIncludeMonth: 'Date of birth must include a month',
      mustIncludeYear: 'Date of birth must include a year',
      required: 'Enter date of birth',
      yearMustIncludeFourNumbers: 'Year must include 4 numbers',
    },
    firstNameRequired: "Enter device wearer's first name",
    genderRequired: "Select the device wearer's gender, or select 'Not able to provide this information'",
    interpreterRequired: 'Select yes if the device wearer requires an interpreter',
    languageRequired: 'Select the language required',
    lastNameRequired: "Enter device wearer's last name",
    responsibleAdultRequired: 'Select yes if a responsible adult is required',
    sexRequired: "Select the device wearer's sex, or select 'Not able to provide this information'",
  },
  monitoringConditions: {
    conditionTypeRequired: 'Select order type condition',
    monitoringTypeRequired: 'Select monitoring required',
    orderTypeRequired: 'Select order type',
    startDateTime: {
      date: {
        mustBeReal: 'Start date for monitoring must be a real date',
        mustIncludeDay: 'Start date for monitoring must include a day',
        mustIncludeMonth: 'Start date for monitoring must include a month',
        mustIncludeYear: 'Start date for monitoring must include a year',
        required: 'Enter start date for monitoring',
        yearMustIncludeFourNumbers: 'Year must include 4 numbers',
      },
      time: {
        mustBeReal: 'Start time for monitoring must be a real time',
        mustIncludeHour: 'Start time for monitoring must include an hour',
        mustIncludeMinute: 'Start time for monitoring must include a minute',
      },
    },
    endDateTime: {
      date: {
        mustBeReal: 'End date for monitoring must be a real date',
        mustIncludeDay: 'End date for monitoring must include a day',
        mustIncludeMonth: 'End date for monitoring must include a month',
        mustIncludeYear: 'End date for monitoring must include a year',
        yearMustIncludeFourNumbers: 'Year must include 4 numbers',
      },
      time: {
        mustBeReal: 'End time for monitoring must be a real time',
        mustIncludeHour: 'End time for monitoring must include an hour',
        mustIncludeMinute: 'End time for monitoring must include a minute',
      },
    },
  },
  notifyingOrganisation: {
    notifyingOrganisationName: 'Select the organisation you are part of',
    responsibleOrganisation: "Select the responsible officer's organisation",
  },
  variationDetails: {
    variationDate: {
      mustBeReal: 'Variation date must be a real date',
      mustIncludeDay: 'Variation date must include a day',
      mustIncludeMonth: 'Variation date must include a month',
      mustIncludeYear: 'Variation date must include a year',
      required: 'Enter Variation date',
      yearMustIncludeFourNumbers: 'Year must include 4 numbers',
    },
    variationTypeRequired: 'Variation type is required',
  },
}

export { validationErrors }
