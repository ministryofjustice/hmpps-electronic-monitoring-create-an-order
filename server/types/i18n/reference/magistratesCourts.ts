import ReferenceData from './reference'

type MagistratesCourts = ReferenceData<
  | 'BARKINGSIDE_MAGISTRATES_COURT'
  | 'BARROW_IN_FURNESS_MAGISTRATES_COURT'
  | 'BASILDON_MAGISTRATES_COURT'
  | 'BASINGSTOKE_MAGISTRATES_COURT'
  | 'BELMARSH_MAGISTRATES_COURT'
  | 'BERWICK_UPON_TWEED_MAGISTRATES_COURT'
  | 'BEVERLEY_MAGISTRATES_COURT'
  | 'BEXLEY_MAGISTRATES_COURT'
  | 'BIRMINGHAM_MAGISTRATES_COURT'
  | 'BLACKBURN_MAGISTRATES_COURT'
  | 'BOLTON_MAGISTRATES_COURT'
  | 'BOSTON_MAGISTRATES_COURT'
  | 'BRADFORD_AND_KEIGHLEY_MAGISTRATES_COURT'
  | 'BRIDLINGTON_MAGISTRATES_COURT'
  | 'BRIGHTON_MAGISTRATES_COURT'
  | 'BRISTOL_MAGISTRATES_COURT'
  | 'BROMLEY_MAGISTRATES_COURT'
  | 'BURNLEY_MAGISTRATES_COURT'
  | 'CAMBRIDGE_MAGISTRATES_COURT'
  | 'CANNOCK_MAGISTRATES_COURT'
  | 'CANTERBURY_MAGISTRATES_COURT'
  | 'CARDIFF_MAGISTRATES_COURT'
  | 'CARLISLE_MAGISTRATES_COURT'
  | 'CHELMSFORD_MAGISTRATES_COURT'
  | 'CHELTENHAM_MAGISTRATES_COURT'
  | 'CHESTER_MAGISTRATES_COURT'
  | 'CITY_OF_LONDON_MAGISTRATES_COURT'
  | 'COLCHESTER_MAGISTRATES_COURT'
  | 'COVENTRY_MAGISTRATES_COURT'
  | 'CRAWLEY_MAGISTRATES_COURT'
  | 'CREWE_SOUTH_CHESHIRE_MAGISTRATES_COURT'
  | 'CROYDON_MAGISTRATES_COURT'
  | 'CWMBRAN_MAGISTRATES_COURT'
  | 'DARLINGTON_MAGISTRATES_COURT'
  | 'DERBY_MAGISTRATES_COURT'
  | 'DUDLEY_MAGISTRATES_COURT'
  | 'EALING_MAGISTRATES_COURT'
  | 'EAST_BERKSHIRE_MAGISTRATES_COURT_SLOUGH'
  | 'FOLKESTONE_MAGISTRATES_COURT'
  | 'GATESHEAD_MAGISTRATES_COURT'
  | 'GREAT_YARMOUTH_MAGISTRATES_COURT'
  | 'GRIMSBY_MAGISTRATES_COURT'
  | 'GUILDFORD_MAGISTRATES_COURT'
  | 'HASTINGS_MAGISTRATES_COURT'
  | 'HATFIELD_MAGISTRATES_COURT'
  | 'HAVERFORDWEST_MAGISTRATES_COURT'
  | 'HENDON_MAGISTRATES_COURT'
  | 'HIGH_WYCOMBE_MAGISTRATES_COURT'
  | 'HIGHBURY_CORNER_MAGISTRATES_COURT'
  | 'HORSHAM_MAGISTRATES_COURT'
  | 'HULL_AND_HOLDERNESS_MAGISTRATES_COURT'
  | 'IPSWICH_MAGISTRATES_COURT'
  | 'KIDDERMINSTER_MAGISTRATES_COURT'
  | 'KINGS_LYNN_MAGISTRATES_COURT'
  | 'KIRKLEES_HUDDERSFIELD_MAGISTRATES_COURT'
  | 'LAVENDER_HILL_MAGISTRATES_COURT'
  | 'LEAMINGTON_SPA_MAGISTRATES_COURT'
  | 'LEEDS_MAGISTRATES_COURT'
  | 'LEICESTER_MAGISTRATES_COURT'
  | 'LINCOLN_MAGISTRATES_COURT'
  | 'LIVERPOOL_AND_KNOWSLEY_MAGISTRATES_COURT'
  | 'LLANDUDNO_MAGISTRATES_COURT'
  | 'LUTON_AND_SOUTH_BEDFORDSHIRE_MAGISTRATES_COURT'
  | 'MAIDSTONE_MAGISTRATES_COURT'
  | 'MANCHESTER_MAGISTRATES_COURT'
  | 'MARGATE_MAGISTRATES_COURT'
  | 'MEDWAY_MAGISTRATES_COURT'
  | 'MILTON_KEYNES_MAGISTRATES_COURT'
  | 'NEWCASTLE_UPON_TYNE_MAGISTRATES_COURT'
  | 'NEWPORT_SOUTH_WALES_MAGISTRATES_COURT'
  | 'NEWTON_ABBOT_MAGISTRATES_COURT'
  | 'NEWTON_AYCLIFFE_MAGISTRATES_COURT'
  | 'NORTH_SOMERSET_MAGISTRATES_COURT'
  | 'NORTH_TYNESIDE_MAGISTRATES_COURT'
  | 'NORTHAMPTON_MAGISTRATES_COURT'
  | 'NORWICH_MAGISTRATES_COURT'
  | 'NOTTINGHAM_MAGISTRATES_COURT'
  | 'NUNEATON_MAGISTRATES_COURT'
  | 'OXFORD_MAGISTRATES_COURT'
  | 'PETERBOROUGH_MAGISTRATES_COURT'
  | 'PETERLEE_MAGISTRATES_COURT'
  | 'PLYMOUTH_MAGISTRATES_COURT'
  | 'POOLE_MAGISTRATES_COURT'
  | 'PORTSMOUTH_MAGISTRATES_COURT'
  | 'PRESTON_MAGISTRATES_COURT'
  | 'READING_MAGISTRATES_COURT'
  | 'REDDITCH_MAGISTRATES_COURT'
  | 'ROMFORD_MAGISTRATES_COURT'
  | 'SEFTON_MAGISTRATES_COURT'
  | 'SEVENOAKS_MAGISTRATES_COURT'
  | 'SHEFFIELD_MAGISTRATES_COURT'
  | 'SKIPTON_MAGISTRATES_COURT'
  | 'SOUTH_TYNESIDE_MAGISTRATES_COURT'
  | 'SOUTHEND_MAGISTRATES_COURT'
  | 'ST_ALBANS_MAGISTRATES_COURT'
  | 'STAINES_MAGISTRATES_COURT'
  | 'STEVENAGE_MAGISTRATES_COURT'
  | 'STOCKPORT_MAGISTRATES_COURT'
  | 'STRATFORD_MAGISTRATES_COURT'
  | 'SWANSEA_MAGISTRATES_COURT'
  | 'SWINDON_MAGISTRATES_COURT'
  | 'TAMESIDE_MAGISTRATES_COURT'
  | 'TAUNTON_MAGISTRATES_COURT'
  | 'TEESSIDE_MAGISTRATES_COURT'
  | 'TELFORD_MAGISTRATES_COURT'
  | 'THAMES_MAGISTRATES_COURT'
  | 'TRURO_MAGISTRATES_COURT'
  | 'UXBRIDGE_MAGISTRATES_COURT'
  | 'WALSALL_MAGISTRATES_COURT'
  | 'WARRINGTON_MAGISTRATES_COURT'
  | 'WELLINGBOROUGH_MAGISTRATES_COURT'
  | 'WELSHPOOL_MAGISTRATES_COURT'
  | 'WEST_HAMPSHIRE_MAGISTRATES_COURT'
  | 'WESTMINSTER_MAGISTRATES_COURT'
  | 'WIGAN_AND_LEIGH_MAGISTRATES_COURT'
  | 'WILLESDEN_MAGISTRATES_COURT'
  | 'WIMBLEDON_MAGISTRATES_COURT'
  | 'WIRRAL_MAGISTRATES_COURT'
  | 'WOLVERHAMPTON_MAGISTRATES_COURT'
  | 'WORTHING_MAGISTRATE_COURT'
  | 'WREXHAM_MAGISTRATES_COURT'
  | 'YEOVIL_COUNTY_MAGISTRATES_COURT'
>

type MagistratesCourtsDDv5 = ReferenceData<
  | 'ABERDARE_MAGISTRATES_COURT'
  | 'ABERGAVENNY_MAGISTRATES_COURT'
  | 'ABERTILLERY_MAGISTRATES_COURT'
  | 'ABERYSTWYTH_MAGISTRATES_COURT'
  | 'ACCRINGTON_MAGISTRATES_COURT'
  | 'ACTON_MAGISTRATES_COURT'
  | 'AIT_STOKE_ON_TRENT_MAGISTRATES_COURT'
  | 'ALDERSHOT_MAGISTRATES_COURT'
  | 'ALNWICK_MAGISTRATES_COURT'
  | 'ALTON_MAGISTRATES_COURT'
  | 'AMERSHAM_MAGISTRATES_COURT'
  | 'AMMANFORD_MAGISTRATES_COURT'
  | 'ANDOVER_MAGISTRATES_COURT'
  | 'ASHFORD_MAGISTRATES_COURT'
  | 'ATHERSTONE_MAGISTRATES_COURT'
  | 'AYLESBURY_MAGISTRATES_COURT'
  | 'BANBURY_MAGISTRATES_COURT'
  | 'BANGOR_MAGISTRATES_COURT'
  | 'BARKINGSIDE_MAGISTRATES_COURT'
  | 'BARNET_MAGISTRATES_COURT'
  | 'BARNSLEY_MAGISTRATES_COURT'
  | 'BARNSTAPLE_MAGISTRATES_COURT'
  | 'BARROW_IN_FURNESS_MAGISTRATES_COURT'
  | 'BARRY_MAGISTRATES_COURT'
  | 'BASILDON_MAGISTRATES_COURT'
  | 'BASINGSTOKE_MAGISTRATES_COURT'
  | 'BATH_MAGISTRATES_COURT'
  | 'BEDFORD_MAGISTRATES_COURT'
  | 'BEDLINGTON_MAGISTRATES_COURT'
  | 'BELMARSH_MAGISTRATES_COURT'
  | 'BERWICK_UPON_TWEED_MAGISTRATES_COURT'
  | 'BEVERLEY_MAGISTRATES_COURT'
  | 'BEXLEY_MAGISTRATES_COURT'
  | 'BICESTER_MAGISTRATES_COURT'
  | 'BINGLEY_MAGISTRATES_COURT'
  | 'BIRKENHEAD_MAGISTRATES_COURT'
  | 'BIRMINGHAM_MAGISTRATES_COURT'
  | 'BISHOP_AUCKLAND_MAGISTRATES_COURT'
  | 'BLACKBURN_MAGISTRATES_COURT'
  | 'BLACKPOOL_MAGISTRATES_AND_CIVIL_COURT'
  | 'BLACKPOOL_MAGISTRATES_COURT'
  | 'BLACKWOOD_MAGISTRATES_COURT'
  | 'BLANDFORD_FORUM_MAGISTRATES_COURT'
  | 'BLANDFORD_MAGISTRATES_COURT'
  | 'BLAYDON_MAGISTRATES_COURT'
  | 'BODMIN_MAGISTRATES_COURT'
  | 'BOLTON_MAGISTRATES_COURT'
  | 'BOOTLE_MAGISTRATES_COURT'
  | 'BOSTON_MAGISTRATES_COURT'
  | 'BOURNE_MAGISTRATES_COURT'
  | 'BOURNEMOUTH_MAGISTRATES_COURT'
  | 'BOW_STREET_MAGISTRATES_COURT'
  | 'BRACKNELL_MAGISTRATES_COURT'
  | 'BRADFORD_AND_KEIGHLEY_MAGISTRATES_COURT'
  | 'BRADFORD_MAGISTRATES_COURT'
  | 'BRECON_MAGISTRATES_COURT'
  | 'BRENT_MAGISTRATES_COURT'
  | 'BRENTFORD_MAGISTRATES_COURT'
  | 'BRIDGEND_MAGISTRATES_COURT'
  | 'BRIDGNORTH_MAGISTRATES_COURT'
  | 'BRIDGWATER_MAGISTRATES_COURT'
  | 'BRIDLINGTON_MAGISTRATES_COURT'
  | 'BRIDPORT_MAGISTRATES_COURT'
  | 'BRIGHTON_MAGISTRATES_COURT'
  | 'BRISTOL_MAGISTRATES_COURT'
  | 'BROMLEY_MAGISTRATES_COURT'
  | 'BURNLEY_MAGISTRATES_COURT'
  | 'BURTON_UPON_TRENT_MAGISTRATES_COURT'
  | 'BURY_MAGISTRATES_COURT'
  | 'BURY_ST_EDMUNDS_MAGISTRATES_COURT'
  | 'BUXTON_MAGISTRATES_COURT'
  | 'CAERNARFON_MAGISTRATES_COURT'
  | 'CAERPHILLY_MAGISTRATES_COURT'
  | 'CAISTOR_MAGISTRATES_COURT'
  | 'CAMBERLEY_MAGISTRATES_COURT'
  | 'CAMBERWELL_GREEN_MAGISTRATES_COURT'
  | 'CAMBORNE_MAGISTRATES_COURT'
  | 'CAMBRIDGE_MAGISTRATES_COURT'
  | 'CANNOCK_MAGISTRATES_COURT'
  | 'CANTERBURY_MAGISTRATES_COURT'
  | 'CARDIFF_MAGISTRATES_COURT'
  | 'CARDIGAN_MAGISTRATES_COURT'
  | 'CARLISLE_MAGISTRATES_COURT'
  | 'CARMARTHEN_MAGISTRATES_COURT'
  | 'CASTLEFORD_MAGISTRATES_COURT'
  | 'CHATHAM_MAGISTRATES_COURT'
  | 'CHELMSFORD_MAGISTRATES_COURT'
  | 'CHELTENHAM_MAGISTRATES_COURT'
  | 'CHEPSTOW_MAGISTRATES_COURT'
  | 'CHESHUNT_MAGISTRATES_COURT'
  | 'CHESTER_LE_STREET_MAGISTRATES_COURT'
  | 'CHESTER_MAGISTRATES_COURT'
  | 'CHICHESTER_MAGISTRATES_COURT'
  | 'CHORLEY_MAGISTRATES_COURT'
  | 'CIRENCESTER_MAGISTRATES_COURT'
  | 'CITY_OF_LONDON_MAGISTRATES_COURT'
  | 'COALVILLE_MAGISTRATES_COURT'
  | 'COLCHESTER_MAGISTRATES_COURT'
  | 'COLEFORD_MAGISTRATES_COURT'
  | 'CONSETT_MAGISTRATES_COURT'
  | 'CORBY_MAGISTRATES_COURT'
  | 'COVENTRY_MAGISTRATES_COURT'
  | 'CRAWLEY_MAGISTRATES_COURT'
  | 'CREWE_SOUTH_CHESHIRE_MAGISTRATES_COURT'
  | 'CREWE_MAGISTRATES_COURT'
  | 'CROMER_MAGISTRATES_COURT'
  | 'CROYDON_MAGISTRATES_COURT'
  | 'CULLOMPTON_MAGISTRATES_COURT'
  | 'CWMBRAN_MAGISTRATES_COURT'
  | 'DARLINGTON_MAGISTRATES_COURT'
  | 'DARTFORD_MAGISTRATES_COURT'
  | 'DAVENTRY_MAGISTRATES_COURT'
  | 'DENBIGH_MAGISTRATES_COURT'
  | 'DERBY_MAGISTRATES_COURT'
  | 'DEVIZES_MAGISTRATES_COURT'
  | 'DEWSBURY_MAGISTRATES_COURT'
  | 'DIDCOT_MAGISTRATES_COURT'
  | 'DOLGELLAU_MAGISTRATES_COURT'
  | 'DONCASTER_MAGISTRATES_COURT'
  | 'DORCHESTER_MAGISTRATES_COURT'
  | 'DORKING_MAGISTRATES_COURT'
  | 'DOVER_MAGISTRATES_COURT'
  | 'DROITWICH_MAGISTRATES_COURT'
  | 'DUDLEY_MAGISTRATES_COURT'
  | 'DURHAM_MAGISTRATES_COURT'
  | 'EALING_MAGISTRATES_COURT'
  | 'EAST_BERKSHIRE_MAGISTRATES_COURT_SLOUGH'
  | 'EASTBOURNE_MAGISTRATES_COURT'
  | 'EASTLEIGH_MAGISTRATES_COURT'
  | 'ELY_MAGISTRATES_COURT'
  | 'ENFIELD_MAGISTRATES_COURT'
  | 'EPPING_MAGISTRATES_COURT'
  | 'EPSOM_MAGISTRATES_COURT'
  | 'EVESHAM_MAGISTRATES_COURT'
  | 'EXETER_MAGISTRATES_COURT'
  | 'FAREHAM_MAGISTRATES_COURT'
  | 'FELTHAM_MAGISTRATES_COURT'
  | 'FLAX_BOURTON_MAGISTRATES_COURT'
  | 'FLEETWOOD_MAGISTRATES_COURT'
  | 'FLINT_MAGISTRATES_COURT'
  | 'FOLKESTONE_MAGISTRATES_COURT'
  | 'FROME_MAGISTRATES_COURT'
  | 'GAINSBOROUGH_MAGISTRATES_COURT'
  | 'GATESHEAD_MAGISTRATES_COURT'
  | 'GLOSSOP_MAGISTRATES_COURT'
  | 'GLOUCESTER_MAGISTRATES_COURT'
  | 'GOOLE_MAGISTRATES_COURT'
  | 'GOSFORTH_MAGISTRATES_COURT'
  | 'GOWERTON_MAGISTRATES_COURT'
  | 'GRANTHAM_MAGISTRATES_COURT'
  | 'GRAYS_MAGISTRATES_COURT'
  | 'GREAT_YARMOUTH_MAGISTRATES_COURT'
  | 'GREENWICH_MAGISTRATES_COURT'
  | 'GRIMSBY_MAGISTRATES_COURT'
  | 'GUILDFORD_MAGISTRATES_COURT'
  | 'GUISBOROUGH_MAGISTRATES_COURT'
  | 'HALESOWEN_MAGISTRATES_COURT'
  | 'HALIFAX_MAGISTRATES_COURT'
  | 'HAMMERSMITH_MAGISTRATES_COURT'
  | 'HARLOW_MAGISTRATES_COURT'
  | 'HARROGATE_MAGISTRATES_COURT'
  | 'HARROW_MAGISTRATES_COURT'
  | 'HARTLEPOOL_MAGISTRATES_COURT'
  | 'HARWICH_MAGISTRATES_COURT'
  | 'HASTINGS_MAGISTRATES_COURT'
  | 'HATFIELD_MAGISTRATES_COURT'
  | 'HAVANT_MAGISTRATES_COURT'
  | 'HAVERFORDWEST_MAGISTRATES_COURT'
  | 'HAYWARDS_HEATH_MAGISTRATES_COURT'
  | 'HEMEL_HEMPSTEAD_MAGISTRATES_COURT'
  | 'HENDON_MAGISTRATES_COURT'
  | 'HERTFORD_MAGISTRATES_COURT'
  | 'HEXHAM_MAGISTRATES_COURT'
  | 'HIGH_WYCOMBE_MAGISTRATES_COURT'
  | 'HIGHBURY_CORNER_MAGISTRATES_COURT'
  | 'HIGHGATE_MAGISTRATES_COURT'
  | 'HINCKLEY_MAGISTRATES_COURT'
  | 'HOLYHEAD_MAGISTRATES_COURT'
  | 'HONITON_MAGISTRATES_COURT'
  | 'HORNCASTLE_MAGISTRATES_COURT'
  | 'HORSEFERRY_ROAD_MAGISTRATES_COURT'
  | 'HORSHAM_MAGISTRATES_COURT'
  | 'HOUGHTON_LE_SPRING_MAGISTRATES_COURT'
  | 'HUDDERSFIELD_MAGISTRATES_COURT'
  | 'HULL_AND_HOLDERNESS_MAGISTRATES_COURT'
  | 'HUNTINGDON_MAGISTRATES_COURT'
  | 'HUYTON_MAGISTRATES_COURT'
  | 'ILKESTON_MAGISTRATES_COURT'
  | 'IPSWICH_MAGISTRATES_COURT'
  | 'ISLES_OF_SCILLY_MAGISTRATES_COURT'
  | 'KENDAL_MAGISTRATES_COURT'
  | 'KETTERING_MAGISTRATES_COURT'
  | 'KIDDERMINSTER_MAGISTRATES_COURT'
  | 'KINGS_LYNN_MAGISTRATES_COURT'
  | 'KINGSTON_UPON_HULL_MAGISTRATES_COURT'
  | 'KINGSTON_UPON_THAMES_MAGISTRATES_COURT'
  | 'KIRKLEES_HUDDERSFIELD_MAGISTRATES_COURT'
  | 'KNOWSLEY_MAGISTRATES_COURT'
  | 'LANCASTER_MAGISTRATES_COURT'
  | 'LAUNCESTON_MAGISTRATES_COURT'
  | 'LAVENDER_HILL_MAGISTRATES_COURT'
  | 'LEAMINGTON_SPA_MAGISTRATES_COURT'
  | 'LEEDS_MAGISTRATES_COURT'
  | 'LEICESTER_MAGISTRATES_COURT'
  | 'LEWES_MAGISTRATES_COURT'
  | 'LEYLAND_MAGISTRATES_COURT'
  | 'LINCOLN_MAGISTRATES_COURT'
  | 'LISKEARD_MAGISTRATES_COURT'
  | 'LIVERPOOL_AND_KNOWSLEY_MAGISTRATES_COURT'
  | 'LLANDOVERY_MAGISTRATES_COURT'
  | 'LLANDRINDOD_WELLS_MAGISTRATES_COURT'
  | 'LLANDUDNO_MAGISTRATES_COURT'
  | 'LLANELLI_MAGISTRATES_COURT'
  | 'LLANGEFNI_MAGISTRATES_COURT'
  | 'LLANTRISANT_MAGISTRATES_COURT'
  | 'LLWYNYPIA_MAGISTRATES_COURT'
  | 'LONG_SUTTON_MAGISTRATES_COURT'
  | 'LOUGHBOROUGH_MAGISTRATES_COURT'
  | 'LOUTH_MAGISTRATES_COURT'
  | 'LOWESTOFT_MAGISTRATES_COURT'
  | 'LUDLOW_MAGISTRATES_COURT'
  | 'LUTON_AND_SOUTH_BEDFORDSHIRE_MAGISTRATES_COURT'
  | 'LUTON_MAGISTRATES_COURT'
  | 'LYNDHURST_MAGISTRATES_COURT'
  | 'MACHYNLLETH_MAGISTRATES_COURT'
  | 'MAIDENHEAD_MAGISTRATES_COURT'
  | 'MAIDSTONE_MAGISTRATES_COURT'
  | 'MANCHESTER_CROWN_SQUARE_MAGISTRATES_COURT'
  | 'MANCHESTER_CIVIL_JUSTICE_CENTRE_MAGISTRATES_COURT'
  | 'MANCHESTER_MAGISTRATES_COURT'
  | 'MANSFIELD_ROSEMARY_ST_MAGISTRATES_COURT'
  | 'MARGATE_MAGISTRATES_COURT'
  | 'MARKET_DRAYTON_MAGISTRATES_COURT'
  | 'MARKET_HARBOROUGH_MAGISTRATES_COURT'
  | 'MEDWAY_MAGISTRATES_COURT'
  | 'MELTON_MOWBRAY_MAGISTRATES_COURT'
  | 'MERTHYR_TYDFIL_MAGISTRATES_COURT'
  | 'MIDDLESBROUGH_TEESSIDE_MAGISTRATES_COURT'
  | 'MILDENHALL_MAGISTRATES_COURT'
  | 'MILTON_KEYNES_MAGISTRATES_COURT'
  | 'MINEHEAD_MAGISTRATES_COURT'
  | 'MOLD_MAGISTRATES_COURT'
  | 'NEATH_MAGISTRATES_COURT'
  | 'NEWARK_MAGISTRATES_COURT'
  | 'NEWBURY_MAGISTRATES_COURT'
  | 'NEWCASTLE_MAGISTRATES_COURT'
  | 'NEWCASTLE_UPON_TYNE_MAGISTRATES_COURT'
  | 'NEWPORT_SOUTH_WALES_MAGISTRATES_COURT'
  | 'NEWPORT_MAGISTRATES_COURT'
  | 'NEWTON_ABBOT_MAGISTRATES_COURT'
  | 'NEWTON_AYCLIFFE_MAGISTRATES_COURT'
  | 'NEWTON_MAGISTRATES_COURT'
  | 'NEWTOWN_MAGISTRATES_COURT'
  | 'NORTH_SHIELDS_MAGISTRATES_COURT'
  | 'NORTH_SOMERSET_MAGISTRATES_COURT'
  | 'NORTH_STAFFORDSHIRE_JUSTICE_CENTRE_MAGISTRATES_COURT'
  | 'NORTH_TYNESIDE_MAGISTRATES_COURT'
  | 'NORTHALLERTON_MAGISTRATES_COURT'
  | 'NORTHAMPTON_MAGISTRATES_COURT'
  | 'NORTHWICH_MAGISTRATES_COURT'
  | 'NORWICH_MAGISTRATES_COURT'
  | 'NOTTINGHAM_MAGISTRATES_COURT'
  | 'NUNEATON_MAGISTRATES_COURT'
  | 'NUNEATON_VICARAGE_ST_MAGISTRATES_COURT'
  | 'OAKHAM_MAGISTRATES_COURT'
  | 'OKEHAMPTON_MAGISTRATES_COURT'
  | 'OLDHAM_MAGISTRATES_COURT'
  | 'ORMSKIRK_MAGISTRATES_COURT'
  | 'OSWESTRY_MAGISTRATES_COURT'
  | 'OXFORD_MAGISTRATES_COURT'
  | 'PENRITH_MAGISTRATES_COURT'
  | 'PENZANCE_MAGISTRATES_COURT'
  | 'PETERBOROUGH_MAGISTRATES_COURT'
  | 'PETERLEE_MAGISTRATES_COURT'
  | 'PICKERING_MAGISTRATES_COURT'
  | 'PLYMOUTH_MAGISTRATES_COURT'
  | 'PONTEFRACT_MAGISTRATES_COURT'
  | 'PONTYPRIDD_MAGISTRATES_COURT'
  | 'POOLE_MAGISTRATES_COURT'
  | 'PORT_TALBOT_MAGISTRATES_COURT'
  | 'PORTSMOUTH_MAGISTRATES_COURT'
  | 'PRESTATYN_MAGISTRATES_COURT'
  | 'PRESTON_MAGISTRATES_COURT'
  | 'PWLLHELI_MAGISTRATES_COURT'
  | 'RAWTENSTALL_MAGISTRATES_COURT'
  | 'READING_MAGISTRATES_COURT'
  | 'REDBRIDGE_MAGISTRATES_COURT'
  | 'REDDITCH_MAGISTRATES_COURT'
  | 'REDHILL_MAGISTRATES_COURT'
  | 'REEDLEY_MAGISTRATES_COURT'
  | 'RETFORD_MAGISTRATES_COURT'
  | 'RHONDDA_MAGISTRATES_COURT'
  | 'RICHMOND_MAGISTRATES_COURT'
  | 'ROCHDALE_MAGISTRATES_COURT'
  | 'ROMFORD_MAGISTRATES_COURT'
  | 'ROSSENDALE_MAGISTRATES_COURT'
  | 'ROTHERHAM_MAGISTRATES_COURT'
  | 'RUGBY_MAGISTRATES_COURT'
  | 'RUGELEY_MAGISTRATES_COURT'
  | 'RUNCORN_MAGISTRATES_COURT'
  | 'RUTLAND_MAGISTRATES_COURT'
  | 'SALE_MAGISTRATES_COURT'
  | 'SALFORD_MAGISTRATES_COURT'
  | 'SALISBURY_MAGISTRATES_COURT'
  | 'SCARBOROUGH_MAGISTRATES_COURT'
  | 'SCUNTHORPE_MAGISTRATES_COURT'
  | 'SEFTON_MAGISTRATES_COURT'
  | 'SELBY_MAGISTRATES_COURT'
  | 'SEVENOAKS_MAGISTRATES_COURT'
  | 'SHEFFIELD_MAGISTRATES_COURT'
  | 'SHERBORNE_MAGISTRATES_COURT'
  | 'SHREWSBURY_MAGISTRATES_COURT'
  | 'SITTINGBOURNE_MAGISTRATES_COURT'
  | 'SKEGNESS_MAGISTRATES_COURT'
  | 'SKIPTON_MAGISTRATES_COURT'
  | 'SLEAFORD_MAGISTRATES_COURT'
  | 'SLOUGH_MAGISTRATES_COURT'
  | 'SOLIHULL_MAGISTRATES_COURT'
  | 'SOUTH_SEFTON_MAGISTRATES_COURT'
  | 'SOUTH_TYNESIDE_MAGISTRATES_COURT'
  | 'SOUTH_WESTERN_MAGISTRATES_COURT'
  | 'SOUTHAMPTON_THE_AVENUE_MAGISTRATES_COURT'
  | 'SOUTHEND_MAGISTRATES_COURT'
  | 'SOUTHEND_ON_SEA_MAGISTRATES_COURT'
  | 'SOUTHPORT_MAGISTRATES_COURT'
  | 'SPALDING_MAGISTRATES_COURT'
  | 'ST_ALBANS_MAGISTRATES_COURT'
  | 'ST_GEORGES_HALL_MAGISTRATES_COURT'
  | 'ST_HELENS_MAGISTRATES_COURT'
  | 'STAFFORD_MAGISTRATES_COURT'
  | 'STAINES_MAGISTRATES_COURT'
  | 'STAMFORD_MAGISTRATES_COURT'
  | 'STEVENAGE_MAGISTRATES_COURT'
  | 'STOCKPORT_MAGISTRATES_COURT'
  | 'STOKE_ON_TRENT_MAGISTRATES_COURT'
  | 'STOURBRIDGE_MAGISTRATES_COURT'
  | 'STRATFORD_MAGISTRATES_COURT'
  | 'STRATFORD_UPON_AVON_MAGISTRATES_COURT'
  | 'STROUD_MAGISTRATES_COURT'
  | 'SUDBURY_MAGISTRATES_COURT'
  | 'SUNDERLAND_MAGISTRATES_COURT'
  | 'SUTTON_COLDFIELD_MAGISTRATES_COURT'
  | 'SUTTON_MAGISTRATES_COURT'
  | 'SWAFFHAM_MAGISTRATES_COURT'
  | 'SWANSEA_MAGISTRATES_COURT'
  | 'SWINDON_MAGISTRATES_COURT'
  | 'TAMESIDE_MAGISTRATES_COURT'
  | 'TAMWORTH_MAGISTRATES_COURT'
  | 'TAUNTON_MAGISTRATES_COURT'
  | 'TEESSIDE_MAGISTRATES_COURT'
  | 'TELFORD_MAGISTRATES_COURT'
  | 'TENBY_MAGISTRATES_COURT'
  | 'TEWKESBURY_MAGISTRATES_COURT'
  | 'THAME_MAGISTRATES_COURT'
  | 'THAMES_MAGISTRATES_COURT'
  | 'THETFORD_MAGISTRATES_COURT'
  | 'TORQUAY_MAGISTRATES_COURT'
  | 'TOTNES_MAGISTRATES_COURT'
  | 'TOTTENHAM_MAGISTRATES_COURT'
  | 'TOWCESTER_MAGISTRATES_COURT'
  | 'TOWER_BRIDGE_MAGISTRATES_COURT'
  | 'TREDEGAR_MAGISTRATES_COURT'
  | 'TROWBRIDGE_MAGISTRATES_COURT'
  | 'TRURO_MAGISTRATES_COURT'
  | 'UXBRIDGE_MAGISTRATES_COURT'
  | 'WAKEFIELD_MAGISTRATES_COURT'
  | 'WALLASEY_MAGISTRATES_COURT'
  | 'WALSALL_MAGISTRATES_COURT'
  | 'WALTHAM_FOREST_MAGISTRATES_COURT'
  | 'WANTAGE_MAGISTRATES_COURT'
  | 'WAREHAM_MAGISTRATES_COURT'
  | 'WARLEY_MAGISTRATES_COURT'
  | 'WARRINGTON_MAGISTRATES_COURT'
  | 'WATFORD_MAGISTRATES_COURT'
  | 'WELLINGBOROUGH_MAGISTRATES_COURT'
  | 'WELLS_MAGISTRATES_COURT'
  | 'WELSHPOOL_MAGISTRATES_COURT'
  | 'WEST_BROMWICH_MAGISTRATES_COURT'
  | 'WEST_HAMPSHIRE_MAGISTRATES_COURT'
  | 'WEST_LONDON_MAGISTRATES_COURT'
  | 'WESTMINSTER_MAGISTRATES_COURT'
  | 'WESTMINSTER_MAGISTRATES_COURT_INTERNATIONAL_DIVISION'
  | 'WESTON_SUPER_MARE_MAGISTRATES_COURT'
  | 'WETHERBY_MAGISTRATES_COURT'
  | 'WEYMOUTH_MAGISTRATES_COURT'
  | 'WHITBY_MAGISTRATES_COURT'
  | 'WHITCHURCH_MAGISTRATES_COURT'
  | 'WHITEHAVEN_MAGISTRATES_COURT'
  | 'WIDNES_MAGISTRATES_COURT'
  | 'WIGAN_AND_LEIGH_MAGISTRATES_COURT'
  | 'WIGAN_MAGISTRATES_COURT'
  | 'WILLESDEN_MAGISTRATES_COURT'
  | 'WIMBLEDON_MAGISTRATES_COURT'
  | 'WIMBORNE_MAGISTRATES_COURT'
  | 'WINCHESTER_COMBINED_COURT_CENTRE_MAGISTRATES_COURT'
  | 'WIRRAL_MAGISTRATES_COURT'
  | 'WISBECH_MAGISTRATES_COURT'
  | 'WITHAM_MAGISTRATES_COURT'
  | 'WITNEY_MAGISTRATES_COURT'
  | 'WOKING_MAGISTRATES_COURT'
  | 'WOLVERHAMPTON_MAGISTRATES_COURT'
  | 'WOOLWICH_MAGISTRATES_COURT'
  | 'WORCESTER_CASTLE_ST_MAGISTRATES_COURT'
  | 'WORKINGTON_MAGISTRATES_COURT'
  | 'WORKSOP_MAGISTRATES_COURT'
  | 'WORTHING_MAGISTRATES_COURT'
  | 'WREXHAM_MAGISTRATES_COURT'
  | 'WYCOMBE_MAGISTRATES_COURT'
  | 'YATE_MAGISTRATES_COURT'
  | 'YEOVIL_COUNTY_MAGISTRATES_COURT'
  | 'YEOVIL_MAGISTRATES_COURT'
  | 'YORK_MAGISTRATES_COURT'
  | 'YSTRADGYNLAIS_MAGISTRATES_COURT'
>

export default MagistratesCourts

export { MagistratesCourtsDDv5 }
