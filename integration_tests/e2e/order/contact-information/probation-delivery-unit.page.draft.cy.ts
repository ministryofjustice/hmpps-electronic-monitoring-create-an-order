import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Probation delivery unit', () => {
    const testFlags = { MAPPA_ENABLED: true }
    context('Viewing a draft order', () => {
      const stubGetOrderForRegion = regionName => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            dataDictionaryVersion: 'DDV5',
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
              notifyingOrganisationEmail: 'test@test.com',
              responsibleOfficerName: 'John Smith',
              responsibleOfficerPhoneNumber: '01234567890',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationRegion: regionName,
              responsibleOrganisationEmail: 'test2@test.com',
            },
          },
        })
      }

      beforeEach(() => {
        cy.task('setFeatureFlags', testFlags)
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.signIn()
      })
      afterEach(() => {
        cy.task('resetFeatureFlags')
      })

      it('Should display contents', () => {
        stubGetOrderForRegion('NORTH_EAST')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
        page.form.shouldNotBeDisabled()
        page.errorSummary.shouldNotExist()
        page.backButton.should('exist')
        page.form.shouldHaveAllOptions()

        page.checkIsAccessible()
      })

      // EAST_MIDLANDS
      it('Should display delivery units for region EAST_MIDLANDS', () => {
        stubGetOrderForRegion('EAST_MIDLANDS')

        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Derby City')
        page.form.unitField.shouldHaveOption('Derbyshire')
        page.form.unitField.shouldHaveOption('East and West Lincolnshire')
        page.form.unitField.shouldHaveOption('Leicester, Leicestershire and Rutland')
        page.form.unitField.shouldHaveOption('Nottingham City')
        page.form.unitField.shouldHaveOption('Nottinghamshire')
      })

      // EAST_OF_ENGLAND
      it('Should display delivery units for region EAST_OF_ENGLAND', () => {
        stubGetOrderForRegion('EAST_OF_ENGLAND')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Bedfordshire')
        page.form.unitField.shouldHaveOption('Cambridgeshire')
        page.form.unitField.shouldHaveOption('Essex North')
        page.form.unitField.shouldHaveOption('Essex South')
        page.form.unitField.shouldHaveOption('Hertfordshire')
        page.form.unitField.shouldHaveOption('Norfolk')
        page.form.unitField.shouldHaveOption('Northamptonshire')
        page.form.unitField.shouldHaveOption('Suffolk')
      })

      // GREATER_MANCHESTER
      it('Should display delivery units for region GREATER_MANCHESTER', () => {
        stubGetOrderForRegion('GREATER_MANCHESTER')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Bolton')
        page.form.unitField.shouldHaveOption('Bury and Rochdale')
        page.form.unitField.shouldHaveOption('Manchester North')
        page.form.unitField.shouldHaveOption('Manchester South')
        page.form.unitField.shouldHaveOption('Oldham')
        page.form.unitField.shouldHaveOption('Salford')
        page.form.unitField.shouldHaveOption('Stockport and Trafford')
        page.form.unitField.shouldHaveOption('Tameside')
        page.form.unitField.shouldHaveOption('Wigan')
      })

      // KENT_SURREY_SUSSEX
      it('Should display delivery units for region KENT_SURREY_SUSSEX', () => {
        stubGetOrderForRegion('KENT_SURREY_SUSSEX')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('East Kent')
        page.form.unitField.shouldHaveOption('East Sussex')
        page.form.unitField.shouldHaveOption('Surrey')
        page.form.unitField.shouldHaveOption('West Kent')
        page.form.unitField.shouldHaveOption('West Sussex')
        page.form.unitField.shouldHaveOption('North Kent and Medway')
      })

      // LONDON
      it('Should display delivery units for region LONDON', () => {
        stubGetOrderForRegion('LONDON')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Barking and Dagenham and Havering')
        page.form.unitField.shouldHaveOption('Brent')
        page.form.unitField.shouldHaveOption('Camden and Islington')
        page.form.unitField.shouldHaveOption('Croydon')
        page.form.unitField.shouldHaveOption('Ealing and Hillingdom') // Note: Typo in enum "Hillingdom" vs "Hillingdon"
        page.form.unitField.shouldHaveOption('Enfield and Haringey')
        page.form.unitField.shouldHaveOption('Greenwich and Bexley')
        page.form.unitField.shouldHaveOption('Hackney and City')
        page.form.unitField.shouldHaveOption('Hammersmith, Fulham, Kensington, Chelsea and Westminster')
        page.form.unitField.shouldHaveOption('Harrow and Barnet')
        page.form.unitField.shouldHaveOption('Kingston, Richmond and Hounslow')
        page.form.unitField.shouldHaveOption('Lambeth')
        page.form.unitField.shouldHaveOption('Lewisham and Bromley')
        page.form.unitField.shouldHaveOption('Newham')
        page.form.unitField.shouldHaveOption('Redbridge and Waltham Forest')
        page.form.unitField.shouldHaveOption('Southwark')
        page.form.unitField.shouldHaveOption('Tower Hamlets')
        page.form.unitField.shouldHaveOption('Wandsworth, Merton and Sutton')
      })

      // NORTH_EAST
      it('Should display delivery units for region NORTH_EAST', () => {
        stubGetOrderForRegion('NORTH_EAST')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('County Durham and Darlington')
        page.form.unitField.shouldHaveOption('Gateshead and South Tyneside')
        page.form.unitField.shouldHaveOption('Newcastle Upon Tyne')
        page.form.unitField.shouldHaveOption('North Tyneside and Northumberland')
        page.form.unitField.shouldHaveOption('Redcar, Cleveland and Middlesbrough')
        page.form.unitField.shouldHaveOption('Stockton and Hartlepool')
        page.form.unitField.shouldHaveOption('Sunderland')
      })

      // NORTH_WEST
      it('Should display delivery units for region NORTH_WEST', () => {
        stubGetOrderForRegion('NORTH_WEST')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Blackburn')
        page.form.unitField.shouldHaveOption('Central Lancashire')
        page.form.unitField.shouldHaveOption('Cheshire East')
        page.form.unitField.shouldHaveOption('Cheshire West')
        page.form.unitField.shouldHaveOption('Cumbria')
        page.form.unitField.shouldHaveOption('East Lancashire')
        page.form.unitField.shouldHaveOption('Knowsley and St Helens')
        page.form.unitField.shouldHaveOption('Liverpool North')
        page.form.unitField.shouldHaveOption('Liverpool South')
        page.form.unitField.shouldHaveOption('North West Lancashire')
        page.form.unitField.shouldHaveOption('Sefton and Merseyside Womens')
        page.form.unitField.shouldHaveOption('Warrington and Halton')
        page.form.unitField.shouldHaveOption('Wirral and ISC Team')
      })

      // SOUTH_CENTRAL
      it('Should display delivery units for region SOUTH_CENTRAL', () => {
        stubGetOrderForRegion('SOUTH_CENTRAL')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Buckinghamshire and Milton Keynes')
        page.form.unitField.shouldHaveOption('East Berkshire')
        page.form.unitField.shouldHaveOption('Hampshire North and East')
        page.form.unitField.shouldHaveOption('Hampshire South and Isle of White') // Note: Typo in enum "White" vs "Wight"
        page.form.unitField.shouldHaveOption('Hampshire South West')
        page.form.unitField.shouldHaveOption('Oxfordshire')
        page.form.unitField.shouldHaveOption('West Berkshire')
      })

      // SOUTH_WEST
      it('Should display delivery units for region SOUTH_WEST', () => {
        stubGetOrderForRegion('SOUTH_WEST')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Bath and North Somerset')
        page.form.unitField.shouldHaveOption('Bristol and South Gloucestershire')
        page.form.unitField.shouldHaveOption('Cornwall and Isles of Scilly')
        page.form.unitField.shouldHaveOption('Devon and Torbay')
        page.form.unitField.shouldHaveOption('Dorset')
        page.form.unitField.shouldHaveOption('Gloucestershire')
        page.form.unitField.shouldHaveOption('Plymouth')
        page.form.unitField.shouldHaveOption('Somerset')
        page.form.unitField.shouldHaveOption('Swindon and Wiltshire')
      })

      // WALES
      it('Should display delivery units for region WALES', () => {
        stubGetOrderForRegion('WALES')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Cardiff and the Vale')
        page.form.unitField.shouldHaveOption('Cwm Taf Morgannwg')
        page.form.unitField.shouldHaveOption('Dyfed Powys')
        page.form.unitField.shouldHaveOption('Gwent')
        page.form.unitField.shouldHaveOption('North Wales')
        page.form.unitField.shouldHaveOption('Swansea, Neath and Port-Talbot')
      })

      // WEST_MIDLANDS
      it('Should display delivery units for region WEST_MIDLANDS', () => {
        stubGetOrderForRegion('WEST_MIDLANDS')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Birmingham Central and South')
        page.form.unitField.shouldHaveOption('Birmingham Courts and Centralised Functions') // Note: Typo in enum "DENTRALISED" vs "Centralised"
        page.form.unitField.shouldHaveOption('Birmingham North, East and Solihull')
        page.form.unitField.shouldHaveOption('Coventry')
        page.form.unitField.shouldHaveOption('Dudley and Sandwell')
        page.form.unitField.shouldHaveOption('Hereford, Shropshire and Telford')
        page.form.unitField.shouldHaveOption('Staffordshire and Stoke')
        page.form.unitField.shouldHaveOption('Walsall and Wolverhampton')
        page.form.unitField.shouldHaveOption('Warwickshire')
        page.form.unitField.shouldHaveOption('Worcestershire')
      })

      // YORKSHIRE_AND_THE_HUMBER
      it('Should display delivery units for region YORKSHIRE_AND_THE_HUMBER', () => {
        stubGetOrderForRegion('YORKSHIRE_AND_THE_HUMBER')
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.unitField.shouldHaveOption('Barnsley and Rotherham')
        page.form.unitField.shouldHaveOption('Bradford and Calderdale')
        page.form.unitField.shouldHaveOption('Doncaster')
        page.form.unitField.shouldHaveOption('Hull and East Riding')
        page.form.unitField.shouldHaveOption('Kirklees')
        page.form.unitField.shouldHaveOption('Leeds')
        page.form.unitField.shouldHaveOption('North and North East Lincs')
        page.form.unitField.shouldHaveOption('North Yorkshire')
        page.form.unitField.shouldHaveOption('Sheffield')
        page.form.unitField.shouldHaveOption('Wakefield')
        page.form.unitField.shouldHaveOption('York')
      })
    })
  })
})
