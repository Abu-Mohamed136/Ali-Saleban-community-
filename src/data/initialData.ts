import { Member, TechnicalStaff, ContentItem, VisitedLocation, CalendarEvent, NoteItem, ExpenseItem } from '../types';

export const INITIAL_TECHNICAL_STAFF: TechnicalStaff[] = [
  {
    id: 'tech-001',
    fullName: 'Adan Deeq Abdirahman Issa',
    role: 'App Developer & Systems Lead',
    phone: '+252 61 157 1310 / +254 722 123 678',
    email: 'adandeeq136@gmail.com',
    specialization: 'Full-Stack Software Architecture, Offline Storage, Mobile Apps & Cloud Integrations',
    isLeadDeveloper: true,
    assignedTasks: 'Architecture of Cali Saleebaan Committee Android App, Local Data Store, WhatsApp APK Builder, Google Maps Integration',
    status: 'Active',
  },
  {
    id: 'tech-002',
    fullName: 'Eng. Sharmaarke Maxamed Warsame',
    role: 'GIS & Land Surveyor',
    phone: '+252 61 723 4410',
    email: 'sharmaarke.gis@kismayo-kulmis.org',
    specialization: 'GPS Cadastral Demarcation, Drone Mapping & Boundary Plotting',
    isLeadDeveloper: false,
    assignedTasks: 'Mapping Kulmis Village boundaries and demarcating 350 residential/communal plots',
    status: 'On Field Survey',
  },
  {
    id: 'tech-003',
    fullName: 'Fartuun Cabdullaahi Nuur',
    role: 'Media & Video Hook Director',
    phone: '+252 61 883 1922',
    email: 'fartuun.media@kismayo-kulmis.org',
    specialization: 'Digital Campaign Hooks, TikTok/WhatsApp Video Storytelling, Community Mobilization',
    isLeadDeveloper: false,
    assignedTasks: 'Drafting weekly video hooks for TikTok and diaspora mobilization campaigns',
    status: 'Active',
  },
  {
    id: 'tech-004',
    fullName: 'Eng. Cabdiraxmaan Cismaan Geelle',
    role: 'Civil & Road Engineer',
    phone: '+252 61 349 8812',
    email: 'geelle.civil@kismayo-kulmis.org',
    specialization: 'Gravel Access Road Grading & Coastal Drainage Solutions',
    isLeadDeveloper: false,
    assignedTasks: 'Supervising 14km graded access road connecting Kismayo coastal highway to Kulmis',
    status: 'Active',
  },
  {
    id: 'tech-005',
    fullName: 'Dr. Jaamac Xasan Cali',
    role: 'Water & Borehole Specialist',
    phone: '+252 61 902 3154',
    email: 'jaamac.hydrology@kismayo-kulmis.org',
    specialization: 'Hydro-geological testing, Solar Deep Borehole Pump Design',
    isLeadDeveloper: false,
    assignedTasks: 'Testing water salinity and depth for Kulmis Central Borehole #1 (120m depth)',
    status: 'Consulting',
  },
  {
    id: 'tech-006',
    fullName: 'Safiyo Maxamuud Jaamac',
    role: 'Finance & Audit Specialist',
    phone: '+252 61 655 0933',
    email: 'safiyo.audit@kismayo-kulmis.org',
    specialization: 'Ledger Reconciliation, Mobile Money Audit & Transparency Reports',
    isLeadDeveloper: false,
    assignedTasks: 'Daily verification of EVC Plus contributions and member receipts reconciliation',
    status: 'Active',
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'CSK-001',
    fullName: 'Ugaas Cabdiqaadir Maxamed Shire',
    phone: '+252 61 552 1100',
    role: 'Committee Elder',
    subClanBranch: 'Cali Saleebaan - Reer Maxamed',
    contributionAmount: 1500,
    pledgedAmount: 1500,
    status: 'Paid',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-09-12',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-001',
    notes: 'Elder Patron of the Kulmis settlement project',
  },
  {
    id: 'CSK-002',
    fullName: 'Sheekh Nuur Xaaji Maxamuud',
    phone: '+252 61 774 2200',
    role: 'Executive Chairman',
    subClanBranch: 'Cali Saleebaan - Reer Cismaan',
    contributionAmount: 1200,
    pledgedAmount: 1200,
    status: 'Paid',
    paymentMethod: 'Bank Transfer (IBS/Premier)',
    dateRegistered: '2026-09-14',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-002',
    notes: 'Oversees committee townhall and community mobilization',
  },
  {
    id: 'CSK-003',
    fullName: 'Axmed Daahir Cabdulle',
    phone: '+252 61 440 9182',
    role: 'Treasurer & Finance',
    subClanBranch: 'Cali Saleebaan - Reer Xirsi',
    contributionAmount: 1000,
    pledgedAmount: 1000,
    status: 'Paid',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-09-15',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-003',
    notes: 'Committee co-signer and mobile ledger custodian',
  },
  {
    id: 'CSK-004',
    fullName: 'Xaliimo Barre Warsame',
    phone: '+252 61 889 4432',
    role: 'Diaspora Coordinator',
    subClanBranch: 'Cali Saleebaan - Reer Cali',
    contributionAmount: 850,
    pledgedAmount: 1000,
    status: 'Partial',
    paymentMethod: 'Bank Transfer (IBS/Premier)',
    dateRegistered: '2026-09-18',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC2-014',
    notes: 'Coordinating contributions from North America & UK diaspora',
  },
  {
    id: 'CSK-005',
    fullName: 'Khadar Maxamed Yuusuf',
    phone: '+252 61 229 1199',
    role: 'Youth Representative',
    subClanBranch: 'Cali Saleebaan - Reer Faarax',
    contributionAmount: 500,
    pledgedAmount: 500,
    status: 'Paid',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-09-20',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC3-045',
    notes: 'Leads local volunteer youth during site boundary clearing',
  },
  {
    id: 'CSK-006',
    fullName: 'Saynab Cumar Cilmi',
    phone: '+252 61 331 4488',
    role: 'Community Member',
    subClanBranch: 'Cali Saleebaan - Reer Maxamed',
    contributionAmount: 300,
    pledgedAmount: 300,
    status: 'Paid',
    paymentMethod: 'Telesom Zaad',
    dateRegistered: '2026-09-22',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC2-019',
    notes: 'First woman builder to begin foundation layout in Kulmis',
  },
  {
    id: 'CSK-007',
    fullName: 'Maxamuud Guuleed Xaashi',
    phone: '+252 61 662 5590',
    role: 'Vice Chairman',
    subClanBranch: 'Cali Saleebaan - Reer Cismaan',
    contributionAmount: 750,
    pledgedAmount: 1000,
    status: 'Partial',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-09-25',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-008',
    notes: 'Handles government liaison with Jubaland Ministry of Public Works',
  },
  {
    id: 'CSK-008',
    fullName: 'Farxiya Yuusuf Samatar',
    phone: '+252 61 990 1234',
    role: 'Community Member',
    subClanBranch: 'Cali Saleebaan - Reer Xirsi',
    contributionAmount: 200,
    pledgedAmount: 500,
    status: 'Partial',
    paymentMethod: 'e-Dahab',
    dateRegistered: '2026-09-28',
    villagePlotAssigned: false,
    notes: 'Pledged balance due at the start of Phase 2 road grading',
  },
  {
    id: 'CSK-009',
    fullName: 'Cismaan Cali Rooble',
    phone: '+252 61 445 7788',
    role: 'General Secretary',
    subClanBranch: 'Cali Saleebaan - Reer Faarax',
    contributionAmount: 600,
    pledgedAmount: 600,
    status: 'Paid',
    paymentMethod: 'Cash in Hand',
    dateRegistered: '2026-10-01',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-010',
    notes: 'Keeper of committee minutes and official stamping',
  },
  {
    id: 'CSK-010',
    fullName: 'Bilal Cabdi Jimcaale',
    phone: '+252 61 511 8822',
    role: 'Community Member',
    subClanBranch: 'Cali Saleebaan - Reer Cali',
    contributionAmount: 0,
    pledgedAmount: 400,
    status: 'Pledged',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-10-05',
    villagePlotAssigned: false,
    notes: 'Pledged for water borehole solar panel procurement',
  },
  {
    id: 'CSK-011',
    fullName: 'Caasho Maxamed Siyaad',
    phone: '+252 61 789 0044',
    role: 'Community Member',
    subClanBranch: 'Cali Saleebaan - Reer Maxamed',
    contributionAmount: 450,
    pledgedAmount: 450,
    status: 'Paid',
    paymentMethod: 'Hormuud EVC Plus',
    dateRegistered: '2026-10-10',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC3-012',
    notes: 'Supports women cooperative market initiative in Kulmis',
  },
  {
    id: 'CSK-012',
    fullName: 'Xasan Nuur Warsame',
    phone: '+252 61 332 9901',
    role: 'Community Member',
    subClanBranch: 'Cali Saleebaan - Reer Cismaan',
    contributionAmount: 500,
    pledgedAmount: 500,
    status: 'Paid',
    paymentMethod: 'Bank Transfer (IBS/Premier)',
    dateRegistered: '2026-10-14',
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC2-031',
    notes: 'Assigned agricultural plot on eastern Kulmis perimeter',
  }
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cont-01',
    title: 'Why Kulmis Village is the Future of Cali Saleebaan',
    targetPlatform: 'TikTok',
    videoHook: 'Stop scrolling! Here is what happens when a united community buys 500 hectares near Kismayo to build their own future village called KULMIS.',
    scriptOutline: '1. Drone shot of the pristine green coastal land near Kismayo.\n2. Interview snippet with Elder Ugaas Cabdiqaadir.\n3. Show the survey pegs and water borehole test.\n4. CTA: Register your name today with the committee to claim your plot!',
    scheduledDate: '2026-10-28',
    status: 'Scheduled',
    campaign: 'Kulmis Expansion',
    createdDate: '2026-10-20',
  },
  {
    id: 'cont-02',
    title: 'Borehole Drilling Live Update from Kulmis',
    targetPlatform: 'WhatsApp Broadcast',
    videoHook: 'Biyaheenii waa soo dhow yihiin! Day 12 of drilling Kulmis deep well. Watch the moment clean sweet water emerged.',
    scriptOutline: '1. Hydrology team measuring 110-meter depth.\n2. Water gushing from the test rig.\n3. Technical team speech by Dr. Jaamac & Adan Deeq.\n4. Detailed breakdown of contributions spent with full financial receipt.',
    scheduledDate: '2026-10-30',
    status: 'Filming',
    campaign: 'Water Well Drive',
    createdDate: '2026-10-21',
  },
  {
    id: 'cont-03',
    title: 'Diaspora Member Spotlight: How to Register from Abroad',
    targetPlatform: 'Facebook',
    videoHook: 'Living in Minnesota, London, or Nairobi and wondering how to secure your family plot in Kulmis, Kismayo? Here is the exact 3-step process.',
    scriptOutline: '1. Screen recording of the Cali Saleebaan mobile app.\n2. How EVC Plus / Dahabshiil transfers are logged transparently.\n3. Plot allocation certificate download.\n4. Contact Diaspora Coordinator Xaliimo Barre.',
    scheduledDate: '2026-11-02',
    status: 'Drafting',
    campaign: 'Diaspora Outreach',
    createdDate: '2026-10-22',
  },
  {
    id: 'cont-04',
    title: '14km Access Road Bulldozer Clearing',
    targetPlatform: 'YouTube Shorts',
    videoHook: 'From dense bush to a 4-lane graded sand highway. See how Kismayo youth cleared the new gateway to Kulmis.',
    scriptOutline: '1. Time-lapse of heavy machinery at work.\n2. Civil engineer Eng. Geelle explaining soil compaction.\n3. Youth volunteers sharing tea and songs.\n4. Call to action for Phase 2 fuel contributions.',
    scheduledDate: '2026-11-05',
    status: 'Idea',
    campaign: 'Road Clearing',
    createdDate: '2026-10-24',
  }
];

export const INITIAL_VISITED_LOCATIONS: VisitedLocation[] = [
  {
    id: 'loc-01',
    name: 'Kulmis Village Central Square & Future Grand Mosque',
    somaliName: 'Fagaaraha Guud ee Kulmis & Masaajidka Weyn',
    category: 'Kulmis Village Core',
    lat: -0.3421,
    lng: 42.5310,
    dateVisited: '2026-10-18',
    visitedBy: 'Elder Council, Eng. Sharmaarke & Adan Deeq Abdirahman',
    findings: 'Flat, elevated plateau with stable red sandy loam soil. Zero flood risk. Pegged central 2-hectare zone for Friday Mosque and administrative hall.',
    expansionPotential: 'Can comfortably accommodate the initial 300 residences with central radial streets.',
  },
  {
    id: 'loc-02',
    name: 'Kulmis Solar Deep Water Borehole Site #1',
    somaliName: 'Goobta Ceel-Biyoodka Qorraxda ee Kulmis',
    category: 'Water Borehole',
    lat: -0.3475,
    lng: 42.5262,
    dateVisited: '2026-10-21',
    visitedBy: 'Dr. Jaamac Xasan (Hydrologist) & Technical Committee',
    findings: 'Hydro-geological survey identified clean sweet water aquifer at 115m depth. Rig mobilization underway. Expected yield: 18m³/hour.',
    expansionPotential: 'Sufficient to supply Kulmis Village drinking water plus 4 livestock troughs.',
  },
  {
    id: 'loc-03',
    name: 'Cali Saleebaan Kismayo Committee Town Office',
    somaliName: 'Xarunta Guddiga Cali Saleebaan ee Magaalada Kismaayo',
    category: 'Committee HQ',
    lat: -0.3582,
    lng: 42.5454,
    dateVisited: '2026-10-25',
    visitedBy: 'Executive Committee & Technical Staff',
    findings: 'Active secretariat office equipped with member registration desk, cash reconciliation, and weekly elder assembly hall.',
    expansionPotential: 'Central operations hub connecting city members to the new settlement.',
  },
  {
    id: 'loc-04',
    name: 'Kulmis Primary School & Maternity Clinic Plot',
    somaliName: 'Goobta Dugsiga Hoose/Dhexe & Xarunta Hooyada iyo Dhallaanka',
    category: 'School & Clinic',
    lat: -0.3390,
    lng: 42.5360,
    dateVisited: '2026-10-12',
    visitedBy: 'Education Sub-committee & Safiyo Maxamuud',
    findings: 'Demarcated 1.5 hectares reserved specifically for 8-classroom primary school, sports pitch, and 12-bed primary health clinic.',
    expansionPotential: 'Pledged support received from diaspora doctors in UK & Scandinavia.',
  },
  {
    id: 'loc-05',
    name: 'Kulmis Main Highway Access Junction',
    somaliName: 'Isku-xiraha Wadada Weyn ee Kismaayo iyo Kulmis',
    category: 'New Road Access',
    lat: -0.3680,
    lng: 42.5210,
    dateVisited: '2026-10-15',
    visitedBy: 'Eng. Cabdiraxmaan Geelle (Civil Eng)',
    findings: 'Grading underway for 14km arterial connection. Culverts needed at 2 seasonal rainwater depressions.',
    expansionPotential: 'Cuts travel time between Kismayo city port and Kulmis from 1h 45m to 25 minutes.',
  },
  {
    id: 'loc-06',
    name: 'Kulmis Eastern Agricultural Allotment Zone',
    somaliName: 'Dhulka Beereedka ee Qaybta Bari ee Kulmis',
    category: 'Farmland Border',
    lat: -0.3340,
    lng: 42.5430,
    dateVisited: '2026-10-09',
    visitedBy: 'Agricultural elders & survey youth',
    findings: 'Rich alluvium soil suitable for maize, watermelon, beans, and sesame with drip irrigation from future Kulmis canal overflow.',
    expansionPotential: '50 individual 1-hectare farming blocks mapped for family self-reliance.',
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-01',
    title: 'General Committee Meeting & Fund Audit',
    date: '2026-10-27',
    time: '16:00',
    type: 'Meeting',
    location: 'Kismayo Committee Office & Google Meet',
    description: 'Reviewing Phase 1 financial ledger, EVC Plus collections, and approving borehole pump procurement.',
  },
  {
    id: 'ev-02',
    title: 'Technical Field Inspection to Kulmis Borehole',
    date: '2026-10-29',
    time: '08:30',
    type: 'Field Survey',
    location: 'Kulmis Village Borehole Rig #1',
    description: 'Adan Deeq Abdirahman Issa and Eng. Sharmaarke verifying depth sensor calibrations and water test samples.',
  },
  {
    id: 'ev-03',
    title: 'TikTok & WhatsApp Video Hook Premiere',
    date: '2026-10-30',
    time: '19:00',
    type: 'Content Post',
    location: 'Online Broadcast Channels',
    description: 'Publishing "Kulmis Village Drone Tour & Water Well Emergence" to accelerate registration.',
  },
  {
    id: 'ev-04',
    title: 'Diaspora Townhall & Virtual Fundraiser',
    date: '2026-11-01',
    time: '20:30',
    type: 'Fundraiser',
    location: 'Zoom & YouTube Live Stream',
    description: 'Targeting $25,000 in pledges for Kulmis Primary School foundation materials.',
  },
  {
    id: 'ev-05',
    title: 'On-Site Member Plot Demarcation Drive',
    date: '2026-11-07',
    time: '07:00',
    type: 'Registration Drive',
    location: 'Kulmis Village Section 2',
    description: 'Assigning physical concrete boundary pegs to registered and paid members (KLM-SEC2 series).',
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-01',
    title: 'Kulmis Village 2026-2028 Masterplan Vision Document',
    category: 'Village Masterplan',
    content: `BISMILLAHI RAXMAANI RAXIIM

CALI SALEEBAAN, KISMAYO COMMITTEE
RESOLUTIONS ON THE EXPANSION OF KULMIS VILLAGE:

1. OBJECTIVE:
To establish an organized, modern, peaceful, and self-sufficient settlement named KULMIS situated approximately 14km north-west of Kismayo, providing residential security, clean water, schooling, and agricultural opportunities for our families and youth.

2. LAND ALLOCATION CRITERIA:
- Tier A (Paid Members): 25m x 30m residential plot upon full payment of minimum $500 community contribution.
- Tier B (Community Elders & Founders): Allocated central perimeter parcels.
- Tier C (Communal Reserves): 2 hectares for Central Mosque, 1.5 hectares for Primary/Secondary School, 1 hectare for Mother & Child Health Clinic, 3 hectares for Public Marketplace.

3. REVENUE TRANSPARENCY:
All funds collected via Hormuud EVC Plus, Telesom Zaad, and Bank transfer must be registered in the official committee ledger maintained by Treasurer Axmed Daahir and verified by Developer Adan Deeq Abdirahman Issa. Full PDF receipts must be generated for all contributing members.`,
    author: 'Sheekh Nuur Xaaji Maxamuud & Adan Deeq Abdirahman Issa',
    dateUpdated: '2026-10-25',
    pinned: true,
  },
  {
    id: 'note-02',
    title: 'Borehole Drilling Hydrology & Water Quality Log',
    category: 'Survey Report',
    content: `HYDROLOGICAL TEST SUMMARY - KULMIS DRILLING SITE #1

- Coordinates: 0°20'51" S, 42°31'34" E
- Static Water Level: 42 meters
- Dynamic Drilling Depth: 118 meters
- Water Electrical Conductivity (EC): 640 µS/cm (Excellent sweet drinking quality, well below WHO salinity threshold)
- Recommended Pumping Unit: 7.5 HP Grundfos submersible pump powered by 24 x 450W solar monocrystalline PV panels.
- Water Storage Tank: 50,000 Liters elevated steel tank on 10-meter tower.`,
    author: 'Dr. Jaamac Xasan Cali & Technical Staff',
    dateUpdated: '2026-10-23',
    pinned: true,
  },
  {
    id: 'note-03',
    title: 'Digital Outreach & Video Hook Campaign Plan',
    category: 'Technical Architecture',
    content: `MEDIA STRATEGY FOR KULMIS ADVANCEMENT:

- Platform 1: WhatsApp Broadcast Groups (Primary mobilization for elders and local Kismayo business owners).
- Platform 2: TikTok & Instagram Reels (Engaging youth in diaspora: UK, USA, Sweden, UAE).
- Hook Formula:
  1. Catch attention with drone footage of green Somali coastal terrain.
  2. Contrast the vision: "Don't rent forever in foreign lands when your clan is building a brand new ocean-breeze town in Kismayo."
  3. Clear numbers: Show exact fund tracker and registered members.
  4. Call to Action: Install our custom committee Android APK to register your phone number and track your plot!`,
    author: 'Fartuun Cabdullaahi & Adan Deeq Abdirahman Issa',
    dateUpdated: '2026-10-22',
    pinned: false,
  }
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-01',
    authorName: 'Adan Deeq Abdirahman Issa',
    authorRole: 'Lead App Developer & Systems Lead (Technical Staff)',
    isAuthorizedOfficer: true,
    title: 'Official Launch of the Cali Saleebaan Kismayo Committee App!',
    content: `Bismillaahi Raxmaani Raxiim.

As-salamu alaykum to all elders, youth, and respected diaspora members of Cali Saleebaan!

We are proud to present our official custom committee mobile app for the expansion of KULMIS Village. Through this system:
1. Every member can verify their phone number and registered plot.
2. 100% transparent tracking of all funds collected via Hormuud EVC Plus, Telesom Zaad, and banks.
3. Interactive Google Maps tracking every site visited and surveyed.
4. Instant PDF receipt downloads for your records.
5. All members can join the conversation below by commenting! Only authorized committee officers can post official announcements and register members.

Please install the app on your phone and share it to our WhatsApp groups!`,
    videoHook: 'The official digital ledger for Kulmis is live! Check your registered plot and contribution receipt directly in the app.',
    imageUrl: '/src/assets/images/committee_meeting_kismayo_1793026691049.jpg',
    campaign: 'Kulmis Expansion',
    createdAt: '2026-10-26T07:30:00Z',
    likes: 48,
    comments: [
      {
        id: 'c-01',
        authorName: 'Ugaas Cabdiqaadir Maxamed Shire',
        authorRoleOrCity: 'Committee Elder Patron',
        commentText: 'Masha’Allah Adan Deeq! Wax weyn baad u qabatay reerka iyo deegaanka Kulmis. Waxaan ugu baaqayaa dhammaan xubnaha inay bixiyaan tabarucaadka.',
        createdAt: '2026-10-26T07:45:00Z',
        likes: 19,
      },
      {
        id: 'c-02',
        authorName: 'Xaliimo Barre Warsame',
        authorRoleOrCity: 'Minneapolis, Minnesota',
        commentText: 'Outstanding work! All of us in the North America diaspora are downloading the app and sharing on WhatsApp. Our receipts printed beautifully!',
        createdAt: '2026-10-26T07:50:00Z',
        likes: 12,
      },
      {
        id: 'c-03',
        authorName: 'Khadar Maxamed Yuusuf',
        authorRoleOrCity: 'Kismayo Youth Representative',
        commentText: 'Dhallinyarada Kismaayo waxay diyaar u yihiin inay dhulka banneeyaan oo dhisaan wadooyinka. Guul Cali Saleebaan iyo Kulmis!',
        createdAt: '2026-10-26T08:00:00Z',
        likes: 8,
      }
    ]
  },
  {
    id: 'post-02',
    authorName: 'Dr. Jaamac Xasan Cali & Adan Deeq',
    authorRole: 'Hydrology Team & Technical Staff',
    isAuthorizedOfficer: true,
    title: 'Sweet Clean Drinking Water Emerges at Kulmis Borehole #1!',
    content: `Alhamdulillah! Today our deep drilling rig reached 118 meters into the coastal aquifer. The laboratory test confirms the water is completely sweet (fresh), with low salinity suitable for our households and farming allotments.

Next week, our civil team will install the 24-solar panel array and 50,000L elevated water storage tank. Thank you to everyone who contributed to the Water Well Fund!`,
    videoHook: 'Day 12 of drilling Kulmis deep well: Watch the moment sweet fresh drinking water gushed from the ground!',
    imageUrl: '/src/assets/images/kulmis_village_expansion_1793026690983.jpg',
    campaign: 'Water Well Drive',
    createdAt: '2026-10-25T14:15:00Z',
    likes: 64,
    comments: [
      {
        id: 'c-04',
        authorName: 'Saynab Cumar Cilmi',
        authorRoleOrCity: 'London, UK',
        commentText: 'Allahu Akbar! Biyuhu waa nolosha. Aad iyo aad ayaan ugu faraxsanahay horumarka degdegga ah ee Kulmis.',
        createdAt: '2026-10-25T15:20:00Z',
        likes: 14,
      },
      {
        id: 'c-05',
        authorName: 'Cismaan Cali Rooble',
        authorRoleOrCity: 'General Secretary',
        commentText: 'Waxaan bilaabaynaa qandaraaska taangiga weyn. Xubnaha kale ee ballanqaaday lacagta fadlan soo dhameystira.',
        createdAt: '2026-10-25T16:00:00Z',
        likes: 7,
      }
    ]
  }
];

export const INITIAL_ACTIVITIES: Array<{
  id: string;
  title: string;
  titleSo: string;
  description: string;
  descriptionSo: string;
  timestamp: string;
  type: 'contribution' | 'member' | 'location' | 'note' | 'post' | 'calendar';
  actor: string;
  targetTab?: string;
}> = [
  {
    id: 'act-01',
    title: 'New Member Registered & Plot Assigned',
    titleSo: 'Xubin Cusub oo Diiwaangashay & Dhul loo Qoondeeyay',
    description: 'Cabdirisaaq Xasan Maxamed registered and was allocated Plot B-14 in Kulmis Sector 2.',
    descriptionSo: 'Cabdirisaaq Xasan Maxamed wuxuu diiwaangeliyay booskiisa B-14 ee Qaybta 2aad ee Kulmis.',
    timestamp: '15 mins ago',
    type: 'member',
    actor: 'Adan Deeq (Technical Lead)',
    targetTab: 'members',
  },
  {
    id: 'act-02',
    title: 'Contribution Received: $1,000 USD',
    titleSo: 'Tabarucaad Cusub: $1,000 USD oo la Helay',
    description: 'Xaliimo Barre Warsame (Minneapolis, USA) sent $1,000 via Premier Bank for Deep Water Well.',
    descriptionSo: 'Xaliimo Barre Warsame waxay bixisay $1,000 oo loogu tala galay Ceelka Biyaha ee Kulmis.',
    timestamp: '42 mins ago',
    type: 'contribution',
    actor: 'Finance & Audit Team',
    targetTab: 'members',
  },
  {
    id: 'act-03',
    title: 'GPS Survey Point Mapped on Google Maps',
    titleSo: 'Goob Cusub oo GPS ah ayaa lagu daray Khariidadda',
    description: 'Surveyed coordinate point (-0.3421, 42.5310) added for Kulmis Deep Borehole Rig #1.',
    descriptionSo: 'Xogta GPS-ka ee Ceel-Biyoodka 1aad ee Kulmis ayaa lagu daabacay khariidadda satellite-ka.',
    timestamp: '2 hours ago',
    type: 'location',
    actor: 'Eng. Sharmaarke (GIS Surveyor)',
    targetTab: 'map',
  },
  {
    id: 'act-04',
    title: 'Official Elder Resolution Published',
    titleSo: 'Go’aan Rasmi ah oo Odayaashu Gaareen ayaa la Daabacay',
    description: 'Minutes of Kismayo Elders Meeting on Water Rig Logistics and plot allocation guidelines.',
    descriptionSo: 'Qoraalka shirkii odayaasha ee ku saabsanaa hannaanka bixinta dhulka iyo qodista biyaha.',
    timestamp: '4 hours ago',
    type: 'note',
    actor: 'Ugaas Cabdiqaadir & Adan Deeq',
    targetTab: 'notes',
  },
  {
    id: 'act-05',
    title: 'New Community Post Published',
    titleSo: 'Qoraal Cusub oo Guddigu Soo Saareen',
    description: 'Official Announcement: Pure Sweet Drinking Water Emerges at Kulmis Borehole #1!',
    descriptionSo: 'Biyo macaan oo cabbitaan ah ayaa ka soo baxay ceelka 1aad ee Kulmis!',
    timestamp: 'Yesterday',
    type: 'post',
    actor: 'Dr. Jaamac Xasan Cali',
    targetTab: 'feed',
  },
  {
    id: 'act-06',
    title: 'Townhall Meeting Scheduled in Big Calendar',
    titleSo: 'Kulanka Odayaasha oo lagu daray Jadwalka',
    description: 'Kulmis Expansion Review meeting scheduled for Friday 10:00 AM at Kismayo Committee Hall.',
    descriptionSo: 'Kulanka guud ee guddiga oo loo asteeyay Jimcaha 10:00 Subaxnimo.',
    timestamp: '2 days ago',
    type: 'calendar',
    actor: 'Cismaan Cali Rooble',
    targetTab: 'calendar',
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-001',
    title: 'Solar Deep Borehole Drilling & Rig Mobilization (120m)',
    titleSo: 'Qodista Ceel-Biyoodka Dheer & Sahanka Biyaha (120m)',
    category: 'Water & Borehole',
    amount: 3200,
    date: '2026-09-24',
    paidTo: 'Jubaland Hydrology & Deep Drilling Co.',
    approvedBy: 'Ugaas Cabdiqaadir & Finance Committee',
    receiptNumber: 'VCH-KLM-0901',
    status: 'Disbursed',
    notes: 'Payment for 120m steel casing pipes, rig transport, and water salinity laboratory clearance'
  },
  {
    id: 'exp-002',
    title: '14km Access Road Bulldozer Clearing & Gravel Grading',
    titleSo: 'Jidka 14km ee Kulmis: Xaaqidda Booyadda & Ciid-dhigidda',
    category: 'Road Clearing & Grading',
    amount: 1450,
    date: '2026-09-29',
    paidTo: 'Al-Nuux Earthmoving & Heavy Equipment Kismayo',
    approvedBy: 'Eng. Cabdiraxmaan Geelle (Civil Eng)',
    receiptNumber: 'VCH-KLM-0902',
    status: 'Disbursed',
    notes: 'Connecting Kismayo coastal highway to central Kulmis market square'
  },
  {
    id: 'exp-003',
    title: 'GPS Cadastral Survey & 350 Plot Concrete Pegging',
    titleSo: 'Sahanka Dayax-gacmeedka GPS & Dhagax-dhigga 350 Boos',
    category: 'Land Survey & Demarcation',
    amount: 850,
    date: '2026-10-04',
    paidTo: 'Kismayo Cadastral Survey Group',
    approvedBy: 'Eng. Sharmaarke Maxamed Warsame (GIS Lead)',
    receiptNumber: 'VCH-KLM-1001',
    status: 'Disbursed',
    notes: 'Concrete marker pegs (20x20m residential plots), GPS boundary registration'
  },
  {
    id: 'exp-004',
    title: 'Community Town Hall Structure & Public Shade Pavilion',
    titleSo: 'Dhismaha Teendhada Shirarka Odayaasha & Xarunta Kulmis',
    category: 'Town Hall & Shelter',
    amount: 420,
    date: '2026-10-11',
    paidTo: 'Waab Dhis Construction Supplies',
    approvedBy: 'Sheekh Nuur Xaaji Maxamuud (Chairman)',
    receiptNumber: 'VCH-KLM-1002',
    status: 'Disbursed',
    notes: 'Galvanized iron poles, shade cloth, and assembly plastic chairs for elder council'
  },
  {
    id: 'exp-005',
    title: 'Elder Council Traditional Arbitration & Logistics',
    titleSo: 'Khidmadda Shirarka Odayaasha Dhaqanka & Xaqiijinta Xuduudaha',
    category: 'Elder Arbitration & Meetings',
    amount: 380,
    date: '2026-10-15',
    paidTo: 'Elder Council Reconciliation Fund',
    approvedBy: 'Ugaas Cabdiqaadir Maxamed Shire',
    receiptNumber: 'VCH-KLM-1003',
    status: 'Disbursed',
    notes: 'Transport, refreshments, and official traditional boundary validation sessions'
  },
  {
    id: 'exp-006',
    title: 'Solar Street Light Poles (5 Units for Central Junction)',
    titleSo: 'Qalabka Nalalka Cadceedda ku shaqeeya ee Isgoyska Dhexe',
    category: 'Solar Street Lighting',
    amount: 550,
    date: '2026-10-18',
    paidTo: 'Sahal Solar Technologies Kismayo',
    approvedBy: 'Axmed Daahir Cabdulle (Treasurer)',
    receiptNumber: 'VCH-KLM-1004',
    status: 'Disbursed',
    notes: 'Installed at central Kulmis mosque and water well intersection for security'
  }
];

