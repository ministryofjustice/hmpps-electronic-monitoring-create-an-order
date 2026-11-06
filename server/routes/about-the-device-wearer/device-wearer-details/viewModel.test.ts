import viewModel from './viewModel'

describe('device wearer details view model', () => {
  it('prefills the saved personal details answers', () => {
    const model = viewModel.construct(
      {
        firstName: 'Jane',
        middleName: 'Ann',
        lastName: 'Example',
        alias: 'Janey',
        dateOfBirth: '1990-03-04T00:00:00.000Z',
        sex: 'FEMALE',
        gender: 'NON_BINARY',
        disabilities: ['VISION'],
        interpreterRequired: true,
      },
      undefined,
      [],
    )

    expect(model).toEqual({
      firstName: { value: 'Jane' },
      middleName: { value: 'Ann' },
      lastName: { value: 'Example' },
      alias: { value: 'Janey' },
      dateOfBirth: { value: expect.objectContaining({ day: '04', month: '03', year: '1990' }) },
      sex: { value: 'FEMALE' },
      gender: { value: 'NON_BINARY' },
      errorSummary: null,
    })
  })

  it('shows blank fields when nothing has been answered', () => {
    const model = viewModel.construct({ firstName: null, sex: null, gender: null, dateOfBirth: null }, undefined, [])

    expect(model.firstName).toEqual({ value: '' })
    expect(model.middleName).toEqual({ value: '' })
    expect(model.sex).toEqual({ value: '' })
    expect(model.gender).toEqual({ value: '' })
    expect(model.dateOfBirth.value).toEqual(expect.objectContaining({ day: '', month: '', year: '' }))
  })

  it('shows errors returned for saved answers when there is no submitted form data', () => {
    const model = viewModel.construct({ firstName: 'Saved', sex: 'MALE' }, undefined, [
      { field: 'dateOfBirth', error: 'Date of birth must be in the past', focusTarget: 'dateOfBirth-day' },
    ])

    expect(model.firstName).toEqual({ value: 'Saved' })
    expect(model.dateOfBirth.error).toEqual({ text: 'Date of birth must be in the past' })
    expect(model.errorSummary?.errorList).toEqual([
      { text: 'Date of birth must be in the past', href: '#dateOfBirth-day' },
    ])
  })

  it('redisplays the submitted form data with errors', () => {
    const model = viewModel.construct(
      { firstName: 'Saved', sex: 'MALE' },
      {
        firstName: '',
        middleName: 'Ann',
        lastName: 'Example',
        alias: '',
        dateOfBirth: { day: '4', month: '', year: '1990' },
        sex: 'FEMALE',
        gender: '',
      },
      [
        { field: 'firstName', error: "Enter device wearer's first name" },
        { field: 'dateOfBirth', error: 'Date of birth must include a month', focusTarget: 'dateOfBirth-month' },
      ],
    )

    expect(model.firstName).toEqual({ value: '', error: { text: "Enter device wearer's first name" } })
    expect(model.middleName).toEqual({ value: 'Ann' })
    expect(model.sex).toEqual({ value: 'FEMALE' })
    expect(model.dateOfBirth).toEqual({
      value: { day: '4', month: '', year: '1990' },
      error: { text: 'Date of birth must include a month' },
    })
    expect(model.errorSummary).toEqual({
      titleText: 'There is a problem',
      errorList: [
        { text: "Enter device wearer's first name", href: '#firstName' },
        { text: 'Date of birth must include a month', href: '#dateOfBirth-month' },
      ],
    })
  })
})
