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
    orderTypeDescriptionRequired: string
    orderTypeRequired: string
    sentenceTypeRequired: string
    pilotRequired: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
  }
  monitoringConditionsAlcohol: {
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
    monitoringTypeRequired: string
    installationLocationRequired: string
  }
  mandatoryAttendanceConditions: {
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
  }
  curfewConditions: {
    addressesRequired: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
  }
  curfewAdditionalDetails: {
    changeCurfewDetailsRequired: string
    curfewDetailsRequired: string
  }
  enforcementZone: {
    descriptionRequired: string
    durationRequired: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
  }
  trailMonitoring: {
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
    variationDetailsRequired: string
  }
  installationLocation: {
    locationRequired: string
  }
  installationAppointment: {
    placeNameRequired: string
    appointmentDate: DateTimeErrorMessages
  }
  installationAndRisk: {
    possibleRiskRequired: string
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

const getMonitoringConditionStartDateTimeErrorMessages = (type: string) => {
  return {
    date: {
      mustBeReal: `Start date for ${type} must be a real date`,
      mustIncludeDay: `Start date for ${type} must include a day`,
      mustIncludeMonth: `Start date for ${type} must include a month`,
      mustIncludeYear: `Start date for ${type} must include a year`,
      required: `Enter start date for ${type}`,
      yearMustIncludeFourNumbers: `Year must include 4 numbers`,
    },
    time: {
      mustBeReal: `Start time for ${type} must be a real time`,
      mustIncludeHour: `Start time for ${type} must include an hour`,
      mustIncludeMinute: `Start time for ${type} must include a minute`,
      required: `Enter start time for ${type}`,
    },
  }
}

const getMonitoringConditionEndDateTimeErrorMessages = (type: string, required: boolean = false) => {
  return {
    date: {
      mustBeReal: `End date for ${type} must be a real date`,
      mustIncludeDay: `End date for ${type} must include a day`,
      mustIncludeMonth: `End date for ${type} must include a month`,
      mustIncludeYear: `End date for ${type} must include a year`,
      yearMustIncludeFourNumbers: `Year must include 4 numbers`,
      required: required ? `Enter end date for ${type}` : undefined,
    },
    time: {
      mustBeReal: `End time for ${type} must be a real time`,
      mustIncludeHour: `End time for ${type} must include an hour`,
      mustIncludeMinute: `End time for ${type} must include a minute`,
      required: `Enter end time for ${type}`,
    },
  }
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
    orderTypeDescriptionRequired: 'Select the type of pilot the device wearer is part of',
    pilotRequired: 'Select the type of pilot the device wearer is part of',
    orderTypeRequired: 'Select order type',
    sentenceTypeRequired: 'Select the type of sentence the device wearer has been given',
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('monitoring', true),
  },
  monitoringConditionsAlcohol: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('alcohol monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('alcohol monitoring', true),
    monitoringTypeRequired: 'Select what alcohol monitoring the device wearer needs',
    installationLocationRequired: 'Select the address of the base station',
  },
  mandatoryAttendanceConditions: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('attendance monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('attendance monitoring', true),
  },
  curfewConditions: {
    addressesRequired: 'Select where the device wearer will be during curfew hours',
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('curfew monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('curfew monitoring', true),
  },
  curfewAdditionalDetails: {
    changeCurfewDetailsRequired: "Select 'Yes' if you want to change the standard curfew address boundary",
    curfewDetailsRequired: 'Enter detail of the curfew address boundary',
  },
  enforcementZone: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('enforcement zone'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('enforcement zone', true),
    descriptionRequired: 'Enforcement zone description is required',
    durationRequired: 'Enforcement zone duration is required',
  },
  trailMonitoring: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('trail monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('trail monitoring', true),
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
    variationTypeRequired: 'Select what you have changed',
    variationDetailsRequired: 'Enter information on what you have changed',
  },
  installationLocation: {
    locationRequired: 'Select where will installation of the electronic monitoring device take place',
  },
  installationAppointment: {
    placeNameRequired: 'Enter name of the place where installation takes place',
    appointmentDate: {
      date: {
        mustBeReal: 'Date of installation must be a real date',
        mustIncludeDay: 'Date of installation must include a day',
        mustIncludeMonth: 'Date of installation must include a month',
        mustIncludeYear: 'Date of installation must include a year',
        yearMustIncludeFourNumbers: 'Year must include 4 numbers',
        required: 'Enter date of installation ',
      },
      time: {
        mustBeReal: 'Time of installation must be a real time',
        mustIncludeHour: 'Time of installation must include an hour',
        mustIncludeMinute: 'Time of installation must include a minute',
        required: 'Enter time of installation',
      },
    },
  },
  installationAndRisk: {
    possibleRiskRequired: "Select all the possible risks from the device wearer's behaviour",
  },
}

export { validationErrors }
