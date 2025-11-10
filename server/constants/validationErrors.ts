interface ValidationErrors {
  attachments: {
    licenceRequired: string
    photoIdentityRequired: string
  }
  address: {
    addressLine1Required: string
    addressLine3Required: string
    postcodeRequired: string
    addAnotherRequired: string
  }
  deviceWearer: {
    dateOfBirth: DateErrorMessages
    firstNameMaxLength: string
    firstNameRequired: string
    genderRequired: string
    interpreterRequired: string
    languageRequired: string
    lastNameMaxLength: string
    lastNameRequired: string
    preferredNameMaxLength: string
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
    isspRequired: string
    hdcRequired: string
    prarrRequired: string
    offenceTypeRequired: string
    policeAreaRequired: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
    addAnotherRequired: string
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
    purposeRequired: string
    appointmentDayRequired: string
    addressLine1Required: string
    addressLine3Required: string
    postcodeRequired: string
    addAnotherRequired: string
  }
  contactInformation: {
    pduRequired: string
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
    descriptionTooLong: string
    durationRequired: string
    durationTooLong: string
    startDateTime: DateTimeErrorMessages
    endDateTime: DateTimeErrorMessages
    anotherZoneRequired: string
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
    variationDetailsTooLong: string
  }
  installationLocation: {
    locationRequired: string
  }
  installationAppointment: {
    placeNameRequired: string
    appointmentDate: DateTimeErrorMessages
  }
  installationAndRisk: {
    offenceRequired: string
    possibleRiskRequired: string
    riskDetailsRequired: string
    riskDetailsTooLong: string
  }
  isRejection: {
    isRejectionRequired: string
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
    licenceRequired: 'Upload a licence or court document',
    photoIdentityRequired: 'Select the photo identification document',
  },
  address: {
    addressLine1Required: 'Enter address line 1, typically the building and street',
    addressLine3Required: 'Enter town or city',
    postcodeRequired: 'Enter postcode',
    addAnotherRequired: 'Select yes if electronic monitoring devices are required at another address',
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
    firstNameMaxLength: 'First name must be 200 characters or less',
    firstNameRequired: "Enter device wearer's first name",
    genderRequired: "Select the device wearer's gender, or select 'Not able to provide this information'",
    interpreterRequired: 'Select yes if the device wearer requires an interpreter',
    languageRequired: 'Select the language required',
    lastNameMaxLength: 'Last name must be 200 characters or less',
    lastNameRequired: "Enter device wearer's last name",
    preferredNameMaxLength: 'Preferred name must be 200 characters or less',
    responsibleAdultRequired: 'Select yes if a responsible adult is required',
    sexRequired: "Select the device wearer's sex, or select 'Not able to provide this information'",
  },
  monitoringConditions: {
    conditionTypeRequired: 'Select order type condition',
    monitoringTypeRequired: 'Select monitoring required',
    orderTypeDescriptionRequired: 'Select the type of pilot the device wearer is part of',
    pilotRequired: 'Select the type of pilot the device wearer is part of',
    orderTypeRequired: 'Select the order type',
    sentenceTypeRequired: 'Select the type of sentence the device wearer has been given',
    isspRequired: 'Select Yes if the device wearer is on the ISSP',
    hdcRequired: 'Select Yes if the device wearer is on a HDC',
    prarrRequired: 'Select if the device wearer is being released on a P-RARR',
    offenceTypeRequired: 'Select the type of offence the device wearer committed',
    policeAreaRequired: "Select the police force area the device wearer's release address is in",
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('monitoring', true),
    addAnotherRequired: 'Select Yes if there are other types of monitoring needed',
  },
  monitoringConditionsAlcohol: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('alcohol monitoring'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('alcohol monitoring', true),
    monitoringTypeRequired: 'Select what alcohol monitoring the device wearer needs',
    installationLocationRequired: 'Select the address of the base station',
  },
  mandatoryAttendanceConditions: {
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('attendance monitoring appointment'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('attendance monitoring appointment', true),
    purposeRequired: 'Enter what the appointment is for',
    appointmentDayRequired: 'Enter on what day the appointment is',
    addressLine1Required: 'Enter address line 1',
    addressLine3Required: 'Enter town or city',
    postcodeRequired: 'Enter postcode',
    addAnotherRequired: 'Select yes if you need to add another appointment',
  },
  contactInformation: {
    pduRequired: "Select the Responsible Organisation's PDU",
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
    startDateTime: getMonitoringConditionStartDateTimeErrorMessages('exclusion zone'),
    endDateTime: getMonitoringConditionEndDateTimeErrorMessages('exclusion zone', true),
    descriptionRequired: 'Enter where the exclusion zone is required',
    descriptionTooLong: 'Where is the exclusion zone must be 200 characters or less',
    durationRequired: 'Enter when the exclusion zone must be followed',
    durationTooLong: 'When must the exclusion zone be followed must be 200 characters or less',
    anotherZoneRequired: 'Select ‘Yes’ if you need to add another exclusion zone',
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
      mustBeReal: 'Date you want changes to take effect must be a real date',
      mustIncludeDay: 'Date you want changes to take effect must include a day',
      mustIncludeMonth: 'Date you want changes to take effect must include a month',
      mustIncludeYear: 'Date you want changes to take effect must include a year',
      required: 'Enter the date you want the changes to take effect',
      yearMustIncludeFourNumbers: 'Year must include 4 numbers',
    },
    variationTypeRequired: 'Select what you have changed',
    variationDetailsRequired: 'Enter information on what you have changed',
    variationDetailsTooLong: 'Information on what you have changed must be 200 characters or less',
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
    offenceRequired: 'Select the type of offence the device wearer committed',
    possibleRiskRequired: "Select all the possible risks from the device wearer's behaviour",
    riskDetailsRequired: 'Enter any other risks to be aware of',
    riskDetailsTooLong: 'Any other risks to be aware of must be 200 characters or less',
  },
  isRejection: {
    isRejectionRequired: "Select 'Yes' if you are making changes because the original was rejected",
  },
}

export { validationErrors }
