const validationErrors = {
  attachments: {
    licenceRequired: 'Select the licence document',
    photoIdentityRequired: 'Select the photo identification document',
  },
  deviceWearer: {
    dobMustBeInPast: 'Date of birth must be in the past',
    dobMustBeReal: 'Date of birth must be a real date',
    dobMustIncludeDay: 'Date of birth must include a day',
    dobMustIncludeMonth: 'Date of birth must include a month',
    dobMustIncludeYear: 'Date of birth must include a year',
    dobRequired: 'Enter date of birth',
    firstNameRequired: "Enter device wearer's first name",
    genderRequired: "Select the device wearer's gender, or select 'Not able to provide this information'",
    interpreterRequired: 'Select yes if the device wearer requires an interpreter',
    languageRequired: 'Select the language required',
    lastNameRequired: "Enter device wearer's last name",
    responsibleAdultRequired: 'Select yes if a responsible adult is required',
    sexRequired: "Select the device wearer's sex, or select 'Not able to provide this information'",
    yearMustIncludeFourNumbers: 'Year must include 4 numbers',
  },
  monitoringConditions: {
    conditionTypeRequired: 'Select order type condition',
    monitoringTypeRequired: 'Select monitoring required',
    orderTypeRequired: 'Select order type',
    startDateMustBeReal: 'Start date for monitoring must be a real date',
    startDateMustIncludeDay: 'Start date for monitoring must include a day',
    startDateMustIncludeMonth: 'Start date for monitoring must include a month',
    startDateMustIncludeYear: 'Start date for monitoring must include a year',
    startDateRequired: 'Enter start date for monitoring',
    yearMustIncludeFourNumbers: 'Year must include 4 numbers',
  },
  notifyingOrganisation: {
    notifyingOrganisationName: 'Select the organisation you are part of',
    responsibleOrganisation: "Select the responsible officer's organisation",
  },
}

export default validationErrors
